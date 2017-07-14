angular.module('app')
.directive('ealoZone', [function() {

  var controller = ['$scope','leafletData','$compile','svrOverPass','Restangular','svrGetRegion',
  function ($scope,leafletData,$compile,svrOverPass,Restangular,svrGetRegion) {

           $scope.get_cpn_area = function(){
             $scope.etape_creation = 0 ;
             svrGetRegion.getRegions(function(regions){
               $scope.subdivision = svrGetRegion.filterRegions(regions) ;

             })
           }

           $scope.cpn_init = function(){
             leafletData.getMap($scope).then(function(map){
                $scope.map = map
                 $scope.map.zoomControl.remove()
                 map.setView([3.86785, 11.52088], 16);
                 $scope.add_menu_to_cpn($scope.map) ;
                $scope.get_cpn_area();

                 })
           }

           $scope.add_menu_to_cpn = function(map){
             var mapMenu = new L.Map.ContextMenu(map)

         mapMenu.addItem({ text: 'recuperer votre cpn zone', callback: function(e){$scope.get_cpn_code(e) } })
         mapMenu.addHooks()

           }
           $scope.get_cpn_code = function(e){
             console.log("on cpn")
             var arrondissement = $scope.get_arrondissement_of(e.latlng)

           }
           $scope.get_arrondissement_of = function(latlng){
              $scope.request_area(latlng,function(data){
                   var name = data["elements"][0].tags.name.trim() ;
                   var region = $scope.subdivision[8][name]

                   var points = $scope.parse_polygon_points(region["points"])
                   var lines = L.polyline(points)
                   //  console.log(lines.getLatLngs());
                   //$scope.transforme_polyline_to_polygone(lines.getLatLngs())
                   var bounds = lines.getBounds() ;
                   $scope.map.fitBounds(bounds);
                   L.rectangle(bounds,{color:"#00bb00"}).addTo($scope.map)
                   L.circle(bounds.getSouthWest()).addTo($scope.map).bindPopup("south West")
                   L.circle(bounds.getNorthWest()).addTo($scope.map).bindPopup("North West")
                   L.circle(bounds.getSouthEast()).addTo($scope.map).bindPopup("South Est")
                   L.circle(bounds.getNorthEast()).addTo($scope.map).bindPopup("North Est")
                   $scope.cpn_draw_area(bounds,{latlng:latlng, cog:data["elements"][0].tags["ref:COG"].trim()})
                   lines.addTo($scope.map)
              })

           }

           $scope.transforme_polyline_to_polygone = function(polyline){
             var lines = polyline;

              var latlngs = [] ;
                   _.each(lines,function(el){

                       _.each(el,function(latlng){
                         latlngs.push(latlng)
                       })
                   })
                   latlngs.push(latlngs[0])

               var polygone = L.polygon(latlngs,{color:"#bb0000"})
                  polygone.addTo($scope.map)
         }

         $scope.remove_duplicate_latlngs = function(el){
           return el

         }

         $scope.succede_lines = function(l1,l2){
           var debut_first_line = l1[0],
           fin_first_line = l1[l1.length - 1],
           debut_second_line = l2[0],
           fin_second_line = l2[l2.length - 1]
           succede = false ;
           if(debut_first_line.equals(debut_second_line)){
             succede = true;
           }
           if(debut_first_line.equals(fin_second_line)){
             succede = true;
           }
           if(fin_first_line.equals(debut_second_line)){
             succede = true;
           }
           if(fin_first_line.equals(fin_second_line)){
             succede = true;
           }
           return succede;
         }



           $scope.cpn_draw_area = function(bounds,obj){
             var cog = $scope.modifier_cog(obj.cog);
             var  sw = bounds.getSouthWest(),
                  ne = bounds.getNorthEast(),
                  lat_debut = sw.lat ,
                  pas = 118 ,
                  start_lat =  Math.floor(lat_debut) + Math.floor((lat_debut - Math.floor(lat_debut))*pas)/pas,
                  lat_fin = ne.lat ,
                  lon_debut = sw.lng ,
                  start_lon =  Math.floor(lon_debut) + Math.floor((lon_debut - Math.floor(lon_debut))*pas)/pas,
                  lon_fin = ne.lng ;


                  precision = 0.00000001,

                  zone = [];
             for(var i = start_lat ; i < lat_fin ; i += 1/pas){
               for(var j= start_lon ; j < lon_fin; j += 1/pas){
                         var paire_lat = Math.round((i-start_lat)*pas)
                         var paire_lng = Math.round((j-start_lon)*pas)
                         var paire = $scope.pairing($scope.pairing(Math.floor(obj.latlng.lat),Math.floor(obj.latlng.lng)) , $scope.pairing(paire_lat,paire_lng))
                       zone.push({geom:[[i,j],[i+(1/pas)- precision ,j+ (1/pas) -precision]], cpn : paire.toString(16).padStart(6 ,"0")})
                      }
                   }


                _.each(zone,function(el){
                  var _color = "#000099" ; //'#'+el.cpn ;
                  var z = L.rectangle(el.geom, {color: _color , weight: 1 }).addTo($scope.map).bindPopup("CPN: "+cog+"-"+ el.cpn)
                      if(z.getBounds().contains(obj.latlng)){
                        z.setStyle({color:"#ff0000"})
                        el.cog = cog ;
                        $scope.current_zone = el
                        $scope.$emit("ealo-zone-created" , { zone : el , targetPoint : obj.latlng })
                      }
                })
                $scope.map.setView([obj.latlng.lat,obj.latlng.lng],18)
             }

       $scope.pairing = function(i,j){
         return ((i>=j) ? (i*j + i +j) : (j*j + i));
       }

       $scope.modifier_cog =function(cog){
         // will be change leter
         // CE:CENTRE , NO:NORD ,ES:EST , LT:LITTORAL , SU :SUD , SW = SUD-OUEST
         // NW:NORD-OUEST , OU:OUEST , AD:ADAMOUA , EN:EXTREME-NORD

         var regions = {
           ce:0,es:7,no:8,lt:1,su:5,sw:4,en:9,ad:6,nw:3,ou:2
         }



         var region = regions[cog.substring(2,0).toLowerCase()];
         var depart = parseInt(cog.substring(2,4)).toString(16);
         var arron = parseInt(cog.substring(4,6)).toString(16);
         return ""+region+""+depart+""+arron ;;
       }

       $scope.get_admin_name = function(n){
         var name = undefined;
         var regions = {
           0:"ce",7:"es",8:"no",1:"lt",5:"su",4:"sw",9:"en",6:"ad",3:"nw",2:"ou"
         }
         var cog = ""+n ;
         var r = regions[parseInt(cog.substring(1,0))].toUpperCase();
         var d = "0"+cog.substring(1,1)
         var a = "0"+cog.substring(1,2)
             cog = cog + d + a ;
       var admins = [{"name":"Mfoundi","ref:COG":"CE01"},{"name":"Diamaré","ref:COG":"EN01"},{"name":"Logone-et-Chari","ref:COG":"EN02"},{"name":"Mayo-Danay","ref:COG":"EN03"},{"name":"Mayo-Kani","ref:COG":"EN04"},{"name":"Mayo-Sava","ref:COG":"EN05"},{"name":"Mayo-Tsanaga","ref:COG":"EN06"},{"name":"Bénoué","ref:COG":"NO01"},{"name":"Faro","ref:COG":"NO03"},{"name":"Mayo-Louti","ref:COG":"NO02"},{"name":"Mayo-Rey","ref:COG":"NO04"},{"name":"Djérem","ref:COG":"AD04"},{"name":"Faro-et-Déo","ref:COG":"AD05"},{"name":"Mayo-Banyo","ref:COG":"AD02"},{"name":"Mbéré","ref:COG":"AD03"},{"name":"Vina","ref:COG":"AD01"},{"name":"Boumba-et-Ngoko","ref:COG":"ES02"},{"name":"Haut-Nyong","ref:COG":"ES03"},{"name":"Kadey","ref:COG":"ES04"},{"name":"Lom-et-Djérem","ref:COG":"ES01"},{"name":"Haute-Sanaga","ref:COG":"CE03"},{"name":"Lekié","ref:COG":"CE06"},{"name":"Mbam-et-Inoubou","ref:COG":"CE07"},{"name":"Mbam-et-Kim","ref:COG":"CE08"},{"name":"Méfou-et-Afamba","ref:COG":"CE09"},{"name":"Méfou-et-Akono","ref:COG":"CE10"},{"name":"Nyong-et-Kéllé","ref:COG":"CE02"},{"name":"Nyong-et-Foumou","ref:COG":"CE04"},{"name":"Nyong-et-So'o","ref:COG":"CE05"},{"name":"Dja-et-Lobo","ref:COG":"SU02"},{"name":"Mvila","ref:COG":"SU01"},{"name":"Océan","ref:COG":"SU03"},{"name":"Vallée-du-Ntem","ref:COG":"SU04"},{"name":"Moungo","ref:COG":"LT02"},{"name":"Nkam","ref:COG":"LT03"},{"name":"Sanaga-Maritime","ref:COG":"LT04"},{"name":"Wouri","ref:COG":"LT01"},{"name":"Bamboutos","ref:COG":"OU02"},{"name":"Haut-Nkam","ref:COG":"OU04"},{"name":"Hauts-Plateaux","ref:COG":"OU08"},{"name":"Nkoung-Khi","ref:COG":"OU07"},{"name":"Menoua","ref:COG":"OU05"},{"name":"Mifi","ref:COG":"OU01"},{"name":"Ndé","ref:COG":"OU06"},{"name":"Noun","ref:COG":"OU03"},{"name":"Boyo","ref:COG":"NW06"},{"name":"Bui","ref:COG":"NW02"},{"name":"Donga-Mantung","ref:COG":"NW03"},{"name":"Menchum","ref:COG":"NW05"},{"name":"Mezam","ref:COG":"NW01"},{"name":"Momo","ref:COG":"NW04"},{"name":"Ngoketunjia","ref:COG":"NW07"},{"name":"Fako","ref:COG":"SW01"},{"name":"Kupe-Muanenguba","ref:COG":"SW06"},{"name":"Lebialem","ref:COG":"SW03"},{"name":"Manyu","ref:COG":"SW02"},{"name":"Meme","ref:COG":"SW04"},{"name":"Ndian","ref:COG":"SW05"},{"name":"Yaoundé I","ref:COG":"CE0101"},{"name":"Yaoundé III","ref:COG":"CE0103"},{"name":"Yaoundé IV","ref:COG":"CE0104"},{"name":"Yaoundé VI","ref:COG":"CE0106"},{"name":"Campo","ref:COG":"SU0302"},{"name":"Bertoua I","ref:COG":"ES0101"},{"name":"Bertoua II","ref:COG":"ES0106"},{"name":"Douala I","ref:COG":"LT0101"},{"name":"Douala II","ref:COG":"LT0102"},{"name":"Douala V","ref:COG":"LT0105"},{"name":"Yaoundé VII","ref:COG":"CE0107"},{"name":"Yaoundé V","ref:COG":"CE0105"},{"name":"Yaoundé II","ref:COG":"CE0102"},{"name":"Edzendouan","ref:COG":"CE0907"},{"name":"Akono","ref:COG":"CE1002"},{"name":"Darak","ref:COG":"EN0209"},{"name":"Blangoua","ref:COG":"EN0206"},{"name":"Hilé - Alifa","ref:COG":"EN0208"},{"name":"Fotokol","ref:COG":"EN0207"},{"name":"Makary","ref:COG":"EN0202"},{"name":"Goulfey","ref:COG":"EN0204"},{"name":"Kousséri","ref:COG":"EN0201"},{"name":"Logone-Birni","ref:COG":"EN0203"},{"name":"Waza","ref:COG":"EN0205"},{"name":"Zina","ref:COG":"EN0210"},{"name":"Mora","ref:COG":"EN0501"},{"name":"Kolofata","ref:COG":"EN0503"},{"name":"Tokombéré","ref:COG":"EN0502"},{"name":"Mozogo","ref:COG":"EN0606"},{"name":"Koza","ref:COG":"EN0603"},{"name":"Soulèdé-Roua","ref:COG":"EN0607"},{"name":"Mokolo","ref:COG":"EN0601"},{"name":"Mogodé","ref:COG":"EN0606"},{"name":"Hina","ref:COG":"EN0604"},{"name":"Bourha","ref:COG":"EN0602"},{"name":"Pétté","ref:COG":"EN0105"},{"name":"Bogo","ref:COG":"EN0103"},{"name":"Dargala","ref:COG":"EN0108"},{"name":"Maroua III","ref:COG":"EN0107"},{"name":"Maroua I","ref:COG":"EN0101"},{"name":"Maroua II","ref:COG":"EN0106"},{"name":"Meri","ref:COG":"EN0102"},{"name":"Ndoukoula","ref:COG":"EN0109"},{"name":"Gazawa","ref:COG":"EN0104"},{"name":"Moulvoudaye","ref:COG":"EN0404"},{"name":"Touloum","ref:COG":"EN0406"},{"name":"Dziguilao","ref:COG":"EN0407"},{"name":"Guidiguis","ref:COG":"EN0403"},{"name":"Kaélé","ref:COG":"EN0401"},{"name":"Moutourwa","ref:COG":"EN0405"},{"name":"Mindif","ref:COG":"EN0402"},{"name":"Maga","ref:COG":"EN0304"},{"name":"Kai-Kai","ref:COG":"EN0311"},{"name":"Guémé","ref:COG":"EN0307"},{"name":"Yagoua","ref:COG":"EN0301"},{"name":"Guéré","ref:COG":"EN0303"},{"name":"Gobo","ref:COG":"EN0308"},{"name":"Wina","ref:COG":"EN0306"},{"name":"Datchéka","ref:COG":"EN0309"},{"name":"Tchatibali","ref:COG":"EN0310"},{"name":"Kalfou","ref:COG":"EN0305"},{"name":"Kar-Hay","ref:COG":"EN0302"},{"name":"Figuil","ref:COG":"NO0203"},{"name":"Guider","ref:COG":"NO0201"},{"name":"Mayo-Oulo","ref:COG":"NO0203"},{"name":"Baschéo","ref:COG":"NO0110"},{"name":"Dembo","ref:COG":"NO0105"},{"name":"Pitoa","ref:COG":"NO0103"},{"name":"Bibemi","ref:COG":"NO0102"},{"name":"Lagdo","ref:COG":"NO0104"},{"name":"Ngong","ref:COG":"NO0106"},{"name":"Touroua","ref:COG":"NO0112"},{"name":"Mayo-Hourna","ref:COG":"NO0109"},{"name":"Gachiga","ref:COG":"NO0111"},{"name":"Garoua I","ref:COG":"NO0101"},{"name":"Garoua II","ref:COG":"NO0107"},{"name":"Garoua III","ref:COG":"NO0108"},{"name":"Béka","ref:COG":"NO0302"},{"name":"Poli","ref:COG":"NO0302"},{"name":"Rey-Bouba","ref:COG":"NO0402"},{"name":"Madingring","ref:COG":"NO0404"},{"name":"Touboro","ref:COG":"NO0403"},{"name":"Tcholliré","ref:COG":"NO0401"},{"name":"Djohong","ref:COG":"AD0303"},{"name":"Ngaoui","ref:COG":"AD0304"},{"name":"Meiganga","ref:COG":"AD0301"},{"name":"Dir","ref:COG":"AD0302"},{"name":"Bélel","ref:COG":"AD0103"},{"name":"Ngan'ha","ref:COG":"AD0107"},{"name":"Nyambaka","ref:COG":"AD0108"},{"name":"Martap","ref:COG":"AD0104"},{"name":"Mbé","ref:COG":"AD0102"},{"name":"Ngaoundéré I","ref:COG":"AD0101"},{"name":"Ngaoundéré II","ref:COG":"AD0105"},{"name":"Ngaoundéré III","ref:COG":"AD0106"},{"name":"Kontcha","ref:COG":"AD0504"},{"name":"Mayo-Baléo","ref:COG":"AD0502"},{"name":"Tignère","ref:COG":"AD0501"},{"name":"Galim-Tignère","ref:COG":"AD0503"},{"name":"Banyo","ref:COG":"AD0201"},{"name":"Bankim","ref:COG":"AD0202"},{"name":"Mayo-Darlé","ref:COG":"AD0203"},{"name":"Ngaoundal","ref:COG":"AD0402"},{"name":"Tabati","ref:COG":"AD0401"},{"name":"Bétaré-Oya","ref:COG":"ES0102"},{"name":"Garoua-Boulaï","ref:COG":"ES0104"},{"name":"Bélabo","ref:COG":"ES0103"},{"name":"Diang","ref:COG":"ES0105"},{"name":"Ngoura","ref:COG":"ES0108"},{"name":"Mandjou","ref:COG":"ES0107"},{"name":"Ouli","ref:COG":"ES0407"},{"name":"Kétté","ref:COG":"ES0403"},{"name":"Batouri","ref:COG":"ES0401"},{"name":"Kentzou","ref:COG":"ES0404"},{"name":"Ndélélé","ref:COG":"ES0402"},{"name":"Mbang","ref:COG":"ES0405"},{"name":"Nguélébok","ref:COG":"ES0406"},{"name":"Gari-Gombo","ref:COG":"ES0203"},{"name":"Yokadouma","ref:COG":"ES0201"},{"name":"Salapoumbé","ref:COG":"ES0204"},{"name":"Mouloundou","ref:COG":"ES0202"},{"name":"Ngoyla","ref:COG":"ES0307"},{"name":"Messock","ref:COG":"ES0312"},{"name":"Lomié","ref:COG":"ES0303"},{"name":"Somalomo","ref:COG":"ES0314"},{"name":"Mindourou","ref:COG":"ES0313"},{"name":"Atok","ref:COG":"ES0309"},{"name":"Messaména","ref:COG":"ES0304"},{"name":"Abong-Mbang","ref:COG":"ES0301"},{"name":"Angossas","ref:COG":"ES0308"},{"name":"Doumaintang","ref:COG":"ES0310"},{"name":"Dimako","ref:COG":"ES0306"},{"name":"Doumé","ref:COG":"ES0302"},{"name":"Mboma","ref:COG":"ES0311"},{"name":"Nguelemendouka","ref:COG":"ES0305"},{"name":"Yoko","ref:COG":"CE0802"},{"name":"Ngambé-Tikar","ref:COG":"CE0803"},{"name":"Ngoro","ref:COG":"CE0804"},{"name":"Ntui","ref:COG":"CE0801"},{"name":"Mbangassina","ref:COG":"CE0805"},{"name":"Minta","ref:COG":"CE0302"},{"name":"Bibey","ref:COG":"CE0305"},{"name":"Nsem","ref:COG":"CE0307"},{"name":"Nanga-Eboko","ref:COG":"CE0301"},{"name":"Lembe","ref:COG":"CE0306"},{"name":"Nkoteng","ref:COG":"CE0304"},{"name":"Mbandjock","ref:COG":"CE0303"},{"name":"Ayos","ref:COG":"CE0402"},{"name":"Kobdombo","ref:COG":"CE0404"},{"name":"Akonolinga","ref:COG":"CE0401"},{"name":"Mengang","ref:COG":"CE0405"},{"name":"Endom","ref:COG":"CE0403"},{"name":"Esse","ref:COG":"CE0902"},{"name":"Afanloum","ref:COG":"CE0905"},{"name":"Olanguina","ref:COG":"CE0906"},{"name":"Awaé","ref:COG":"CE0903"},{"name":"Soa","ref:COG":"CE0904"},{"name":"Nkolafamba","ref:COG":"CE0908"},{"name":"Mfou","ref:COG":"CE0901"},{"name":"Dzeng","ref:COG":"CE0502"},{"name":"Nkol-Métet","ref:COG":"CE0506"},{"name":"Mbalmayo","ref:COG":"CE0501"},{"name":"Akoéman","ref:COG":"CE0504"},{"name":"Mengueme","ref:COG":"CE0505"},{"name":"Ngomedzap","ref:COG":"CE0503"},{"name":"Bikok","ref:COG":"CE1004"},{"name":"Ngoumou","ref:COG":"CE1001"},{"name":"Mbankomo","ref:COG":"CE1003"},{"name":"Lobo","ref:COG":"CE0609"},{"name":"Okala","ref:COG":"CE0607"},{"name":"Evodoula","ref:COG":"CE0604"},{"name":"Monatélé","ref:COG":"CE0601"},{"name":"Sa'a","ref:COG":"CE0602"},{"name":"Ebebda","ref:COG":"CE0605"},{"name":"Elig-Mfomo","ref:COG":"CE0606"},{"name":"Obala","ref:COG":"CE0603"},{"name":"Batchenga","ref:COG":"CE0608"},{"name":"Deuk","ref:COG":"CE0705"},{"name":"Bafia","ref:COG":"CE0701"},{"name":"Kon-Yambetta","ref:COG":"CE0708"},{"name":"Bokito","ref:COG":"CE0702"},{"name":"Kiiki","ref:COG":"CE0707"},{"name":"Nitoukou","ref:COG":"CE0709"},{"name":"Makenene","ref:COG":"CE0706"},{"name":"Ndikiniméki","ref:COG":"CE0703"},{"name":"Makak","ref:COG":"CE0202"},{"name":"Bondjock","ref:COG":"CE0209"},{"name":"Matomb","ref:COG":"CE0206"},{"name":"Bot-Makak","ref:COG":"CE0203"},{"name":"Nguibassal","ref:COG":"CE0210"},{"name":"Ngog-Mapubi","ref:COG":"CE0205"},{"name":"Dibang","ref:COG":"CE0207"},{"name":"Biyouha","ref:COG":"CE0208"},{"name":"Messondo","ref:COG":"CE0204"},{"name":"Éséka","ref:COG":"CE0201"},{"name":"Mintom","ref:COG":"SU0206"},{"name":"Djoum","ref:COG":"SU0202"},{"name":"Oveng","ref:COG":"SU0207"},{"name":"Meyomessi","ref:COG":"SU0208"},{"name":"Sangmélima","ref:COG":"SU0201"},{"name":"Meyomessala","ref:COG":"SU0205"},{"name":"Zoétélé","ref:COG":"SU0204"},{"name":"Bengbis","ref:COG":"SU0203"},{"name":"Mvangan","ref:COG":"SU0103"},{"name":"Biwong-Bulu","ref:COG":"SU0106"},{"name":"Ebolowa II","ref:COG":"SU0108"},{"name":"Mengong","ref:COG":"SU0105"},{"name":"Ngoulémakong","ref:COG":"SU0102"},{"name":"Ebolowa I","ref:COG":"SU0101"},{"name":"Efoulan","ref:COG":"SU0107"},{"name":"Biwong-Bané","ref:COG":"SU0104"},{"name":"Ambam","ref:COG":"SU0401"},{"name":"Kyé-Ossi","ref:COG":"SU0404"},{"name":"Ma'an","ref:COG":"SU0402"},{"name":"Olamzé","ref:COG":"SU0403"},{"name":"Mvengue","ref:COG":"SU0305"},{"name":"Lolodorf","ref:COG":"SU0303"},{"name":"Bipindi","ref:COG":"SU0307"},{"name":"Akom II","ref:COG":"SU0304"},{"name":"Lokoundjé","ref:COG":"SU0308"},{"name":"Kribi I","ref:COG":"SU0301"},{"name":"Kribi II","ref:COG":"SU0307"},{"name":"Niété","ref:COG":"SU0309"},{"name":"Ndom","ref:COG":"LT0404"},{"name":"Nyanon","ref:COG":"LT0411"},{"name":"Massok","ref:COG":"LT0410"},{"name":"Ngambé","ref:COG":"LT0402"},{"name":"Pouma","ref:COG":"LT0403"},{"name":"Ngwei","ref:COG":"LT0409"},{"name":"Édéa I","ref:COG":"LT0401"},{"name":"Édéa II","ref:COG":"LT0407"},{"name":"Dizangué","ref:COG":"LT0405"},{"name":"Dibamba","ref:COG":"LT0408"},{"name":"Mouanko","ref:COG":"LT0406"},{"name":"Douala VI","ref:COG":"LT0106"},{"name":"Douala III","ref:COG":"LT0103"},{"name":"Douala IV","ref:COG":"LT0104"},{"name":"Yingui","ref:COG":"LT0302"},{"name":"Yabassi","ref:COG":"LT0301"},{"name":"Ndobian","ref:COG":"LT0304"},{"name":"Nkondjock","ref:COG":"LT0304"},{"name":"Bonaléa","ref:COG":"LT0212"},{"name":"Dibombari","ref:COG":"LT0203"},{"name":"Loum","ref:COG":"LT0206"},{"name":"Mbanga","ref:COG":"LT0202"},{"name":"Mombo","ref:COG":"LT0213"},{"name":"Penja","ref:COG":"LT0209"},{"name":"Manjo","ref:COG":"LT0204"},{"name":"Ebone","ref:COG":"LT0208"},{"name":"Baré","ref:COG":"LT0207"},{"name":"Mélong","ref:COG":"LT0205"},{"name":"Nkongsamba I","ref:COG":"LT0201"},{"name":"Nkongsamba II","ref:COG":"LT0210"},{"name":"Nkongsamba III","ref:COG":"LT0211"},{"name":"Tiko","ref:COG":"SW0103"},{"name":"Limbé III","ref:COG":"SW0106"},{"name":"Limbé I","ref:COG":"SW0101"},{"name":"Limbé II","ref:COG":"SW0105"},{"name":"Buea","ref:COG":"SW0102"},{"name":"Idenau","ref:COG":"SW0107"},{"name":"Muyuka","ref:COG":"SW0104"},{"name":"Mbonge","ref:COG":"SW0402"},{"name":"Kumba I","ref:COG":"SW0401"},{"name":"Kumba III","ref:COG":"SW0405"},{"name":"Kumba II","ref:COG":"SW0404"},{"name":"Konye","ref:COG":"SW0403"},{"name":"Bangem","ref:COG":"SW0601"},{"name":"Tombel","ref:COG":"SW0603"},{"name":"Nguti","ref:COG":"SW0602"},{"name":"Toko","ref:COG":"SW0509"},{"name":"Mudemba","ref:COG":"SW0501"},{"name":"Isanguele","ref:COG":"SW0504"},{"name":"Idabato","ref:COG":"SW0505"},{"name":"Kombo-Abedimo","ref:COG":"SW0507"},{"name":"Kombo-Itindi","ref:COG":"SW0506"},{"name":"Bamusso","ref:COG":"SW0503"},{"name":"Dikome-Balue","ref:COG":"SW0508"},{"name":"Ekondo-Titi","ref:COG":"SW0502"},{"name":"Eyumodjock","ref:COG":"SW0203"},{"name":"Mamfé","ref:COG":"SW0201"},{"name":"Tinto","ref:COG":"SW0204"},{"name":"Akwaya","ref:COG":"SW0202"},{"name":"Alou","ref:COG":"SW0303"},{"name":"Menji","ref:COG":"SW0301"},{"name":"Wabane","ref:COG":"SW0302"},{"name":"Bangangté","ref:COG":"OU0601"},{"name":"Tonga","ref:COG":"OU0603"},{"name":"Bazou","ref:COG":"OU0602"},{"name":"Foumbot","ref:COG":"OU0302"},{"name":"Malentouen","ref:COG":"OU0304"},{"name":"Foumban","ref:COG":"OU0301"},{"name":"Massangam","ref:COG":"OU0305"},{"name":"Kouoptamo","ref:COG":"OU0308"},{"name":"Koutaba","ref:COG":"OU0306"},{"name":"Bangourain","ref:COG":"OU0307"},{"name":"Njimom","ref:COG":"OU0309"},{"name":"Magba","ref:COG":"OU0303"},{"name":"Bafoussam I","ref:COG":"OU0101"},{"name":"Bafoussam II","ref:COG":"OU0102"},{"name":"Bafoussam III","ref:COG":"OU0103"},{"name":"Pete-Bandjoun","ref:COG":"OU0702"},{"name":"Bayangam","ref:COG":"OU0701"},{"name":"Demding","ref:COG":"OU0703"},{"name":"Bamendjou","ref:COG":"OU0801"},{"name":"Baham","ref:COG":"OU0801"},{"name":"Bangou","ref:COG":"OU0803"},{"name":"Batié","ref:COG":"OU0804"},{"name":"Bana","ref:COG":"OU0402"},{"name":"Bandja","ref:COG":"OU0403"},{"name":"Bafang","ref:COG":"OU0401"},{"name":"Bakou","ref:COG":"OU0407"},{"name":"Banka","ref:COG":"OU0405"},{"name":"Banwa","ref:COG":"OU0406"},{"name":"Kékem","ref:COG":"OU0404"},{"name":"Dschang","ref:COG":"OU0501"},{"name":"Fokoué","ref:COG":"OU0504"},{"name":"Fongo-Tongo","ref:COG":"OU0506"},{"name":"Santchou","ref:COG":"OU0503"},{"name":"Nkong-Zem","ref:COG":"OU0505"},{"name":"Penka-Michel","ref:COG":"OU0502"},{"name":"Batcham","ref:COG":"OU0202"},{"name":"Babadjou","ref:COG":"OU0204"},{"name":"Galim","ref:COG":"OU0203"},{"name":"Mbouda","ref:COG":"OU0201"},{"name":"Balikumbat","ref:COG":"NW0703"},{"name":"Ndop","ref:COG":"NW0701"},{"name":"Babessi","ref:COG":"NW0702"},{"name":"Jakiri","ref:COG":"NW0202"},{"name":"Mbiame","ref:COG":"NW0203"},{"name":"Kumbo","ref:COG":"NW0201"},{"name":"Nkum","ref:COG":"NW0206"},{"name":"Elak","ref:COG":"NW0204"},{"name":"Nkor","ref:COG":"NW0205"},{"name":"Bali","ref:COG":"NW0102"},{"name":"Santa","ref:COG":"NW0105"},{"name":"Bamenda I","ref:COG":"NW0101"},{"name":"Bamenda II","ref:COG":"NW0106"},{"name":"Bamenda III","ref:COG":"NW0107"},{"name":"Bafut","ref:COG":"NW0104"},{"name":"Tubah","ref:COG":"NW0103"},{"name":"Batibo","ref:COG":"NW0402"},{"name":"Mbengwi","ref:COG":"NW0401"},{"name":"Andek","ref:COG":"NW0404"},{"name":"Nijkwa","ref:COG":"NW0403"},{"name":"Widikum-Boffé","ref:COG":"NW0405"},{"name":"Belo","ref:COG":"NW0603"},{"name":"Fundong","ref:COG":"NW0601"},{"name":"Njinikom","ref:COG":"NW0604"},{"name":"Fonfuka","ref:COG":"NW0602"},{"name":"Benakuma","ref:COG":"NW0504"},{"name":"Wum","ref:COG":"NW0501"},{"name":"Zhoa","ref:COG":"NW0503"},{"name":"Furu-Awa","ref:COG":"NW0502"},{"name":"Misaje","ref:COG":"NW0305"},{"name":"Nkambe","ref:COG":"NW0301"},{"name":"Ako","ref:COG":"NW0303"},{"name":"Ndu","ref:COG":"NW0304"},{"name":"Nwa","ref:COG":"NW0302"},{"name":"Bassamba","ref:COG":"OU0604"},{"name":"Ombessa","ref:COG":"CE0704"}]
           _.each(admins,function(el){
              if(el["ref:COG"] = cog ){
                name = el
              }
           })
         return el
       }

       $scope.timer_waiting = function(id,t,fn){
         var init = 0 ;

       }

       $scope.request_area = function(e,fn){
         var query ="[out:json];is_in("+e.lat+","+e.lng+"); area._[admin_level=8] ; out; "
            svrOverPass.requestOsm(query,function(data){
               fn(data);
            })
       }

       $scope.parse_polygon_points = function(points){
         var _points = _.map(JSON.parse(points) ,
                  function(e){
                    return _.map(e,
                      function(t){
                        return JSON.parse(t)
                      })
                    })
         return _points;
       }

       $scope.$on("ealo-subdvision-selected", function(e,v){
         e.stopPropagation();
         if( $scope.ealo_zone_current_line){
            $scope.ealo_zone_current_line.removeFrom($scope.map)
         }
         $scope.ealo_zone_current_line = L.polyline(v.points,{color:"#990000"})
         $scope.ealo_zone_current_line.addTo($scope.map)
       })

       $scope.cpn_init();
}];

  return {
    templateUrl: '/app/templates/modals/get_cpn_area.html',
    bindToController : true,
    controllerAs : 'ctrl',
    controller : controller
  }
}])
