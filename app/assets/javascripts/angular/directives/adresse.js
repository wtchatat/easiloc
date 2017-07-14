angular.module('app')
.directive('ealoAdresse', [function() {

  var controller = ['$scope','leafletData','$compile','svrOverPass','Restangular', function ($scope,leafletData,$compile,svrOverPass,Restangular) {
           //var self = this ;

          function init() {
            var selectedPlace = $scope.$parent.selected_place
            //console.log($scope)
              $scope.etape_creation = 0 ;
              load_map() ;

              if(selectedPlace){
                create_adresse_modal(selectedPlace , undefined)
              }
          }
          function load_map(){
                leafletData.getMap($scope).then(function(map){
                   $scope.map = map
                   $scope.map.zoomControl.remove()
                   var mapMenu = new L.Map.ContextMenu(map) ;
                   mapMenu.addItem({ text: 'Creer une addresse', callback: function(e){create_adresse(e) } })
                   mapMenu.addHooks()
                   map.setView([3.86785, 11.52088], 16);
                 })
                  }
          function create_adresse(e){
            $scope.map.setView([e.latlng.lat, e.latlng.lng], 18);
            $scope.cp = e.latlng;
            $scope.marker = L.marker([e.latlng.lat, e.latlng.lng],{draggable:true})
            var btn ='<div style="text-align:center">Ajuster votre localisation<br/>'+
                     '<a style="color:#fff" ng-click="create_adresse_modal(cp,marker)" class="btn btn-primary btn-xs">'+
                     '<i class="fa fa-check"></i> valider </a></div>';

            $scope.marker.addTo($scope.map)
           .bindPopup($compile(btn)($scope)[0])
           .openPopup();
            $scope.marker.on("moveend",function(e){
             $scope.cp = e.target._latlng
           })

          }

          function create_adresse_modal(cp,marker){
              if(marker){
                marker.removeFrom($scope.map)
              }
                $scope.map.setView([cp.lat, cp.lng], 18);
              getAdresse(cp)

          }

          function getAdresse(latlng){

            $scope.init_location_search = true
            $scope.show = false;
           $scope.localisation = {} ;
           $scope.types = ["prive" , "public" ]
           $scope.categories = [
             "bar","restaurant","restaurant rapide" , "glacier" , "ecole" , "crêche", "Institut superieur","librairie","centre d'apprentissage","université","laverie","location vehicules",
             "gare routiere","parking","banque-dab","dab","banque","bureau de change","centre culturel","salle de jeux","salle de fêtes","salle de cinema", "boite de nuit",
             "foyer social","toilette publique","clinique","cabinet dentaire","hopital","centre de santé","pharmacie","veterinaire",
             "prison","boulangerie","marché","poisonnerie","mairie","gendarmerie","centre de formation","ministere","delegation ministerielle",
             "magasin-electromenager","magasin-pret à porter","magasin-jouets","magasin","commisariat","salon de coiffure","quincaillerie",
             "sapeur pompier","entreprise"
           ].sort()

           $scope.localisation.lat =latlng.lat ;
           $scope.localisation.lng = latlng.lng ;

           var query =  "[out:json];way(around:50,"+ $scope.localisation.lat+","+$scope.localisation.lng+")['building'];(._; >;); out;"

                $scope.map.zoomControl.remove();
                $scope.map.setView([latlng.lat, latlng.lng], 18);
                svrOverPass.requestOsm(query,function(data){

                 $scope.show = true ;
              // retrouve la maison la plus proche definit clique sur la maison que l'on estime que c'est a notre
                 var element = svrOverPass.getWays(data.elements) ;

                     var points = {}
                      _.each(element,function(el,i){ points[i] =  _.map(el.nodes,function(e){
                        return [e.lat , e.lon ] ;
                      })})
                  var active = null ;
                  var polygons = [] ;

                 _.each(points, function(ele,j){
                   var polygon_interne = L.polygon(ele,{color:"#00bb00" , smoothFactor : 1})
                       var inside = isMarkerInsidePolygon(polygon_interne,$scope.localisation)
                       if(inside){
                          polygons.push({poly:polygon_interne , id : j})
                       }
                     })

                         //var filter_poylgons = $scope.check_inside(polygons,$scope.localisation)
                         if(polygons.length < 1){
                           $scope.not_founded_localisation = true ;
                         }else{

                           var i = polygons[0]["id"]
                           var polygon = polygons[0]["poly"].addTo($scope.map)
                           $scope.element = polygon
                           // choisir le premier element du polygon pour s'assurer que les donnees sont les memes
                          // precise_regions(latlng , $scope.map)

                           precise_regions(latlng, $scope.map , polygon.getLatLngs()[0])
                           $scope.element.bindPopup($compile('<div style="text-align:center">Annulez cette selection <br/><a style="color:#fff" ng-click="remove_selection(parent_scope)" class="btn btn-warning btn-xs"><i class="fa fa-close"></i> Annuler </a></div>')($scope)[0])
                           $scope.localisation.building_id = element[i].id
                           $scope.localisation.name = element[i].tags.name
                           $scope.localisation.categorie = element[i].tags.amenity


                         }

           })
          }

      function precise_regions(latlng,map,latlngs){
        var query ="[out:json];is_in("+latlng.lat+","+latlng.lng+"); area._[admin_level] ; out; "
        var query2 = "[out:json];way(around:100,"+latlng.lat+","+latlng.lng+")['highway'~'secondary|primary|residential|trunk|tertiary'];(._; >;); out;"
        var place_point = {} ;
        var route = []
        svrOverPass.requestOsm(query,function(data){
          _.each(data.elements , function(e){
               place_point[e.tags.admin_level] = e.tags.name
               place_point[e.tags.admin_level+"_id"] = e.id
            })
           $scope.place_point = place_point
           svrOverPass.requestOsm(query2,function(data){
             var element = svrOverPass.getWays(data.elements) ;
             var points = {}
             var lines = []
              _.each(element,function(el,i){ points[i] =  _.map(el.nodes,function(e){
               return [e.lat , e.lon ] ;
             }) })
              var active = null ;
             _.each(points, function(ele,i){
                     var line =  L.polyline(ele,{color:"#993300" , smoothFactor : 1}).addTo($scope.map) ;
                       line.id = element[i].id
                       line.name = element[i].tags.name
                     lines.push(line) ;

             })
             var proche = null ;
             var proches = [] ;
             _.each(latlngs,function(_latlng){
                proches.push(L.LineUtil.proche(lines,_latlng));

             })
            proches.sort(function(a,b){
              return a.distance - b.distance ;
            })
            //proche = L.LineUtil.proche(lines,latlng) ;
             proche = proches[0]

             var orientation = L.LineUtil.pointOrientation(proche.line,proche.point)
              $scope.lines = lines
               proche.line.setStyle({color:"#0000bb"})
               proche.line.bindPopup("<div class=''>La plus proche rue</div><div class=''>"+proche.line.name+"</div>")
               $scope.proche = proche.line
               $scope.localisation.road_id =proche.line.id
               $scope.localisation.position  = orientation[1]
        });
        })
      }


      function isMarkerInsidePolygon(poly,p) {
          var polyPoints = poly.getLatLngs()[0];
          var x = p.lat, y = p.lng;

          var inside = false;
          for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
              var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
              var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

              var intersect = ((yi > y) != (yj > y))
                  && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
              if (intersect) inside = !inside;
          }

          return inside;
      };




              init();

          $scope.create_adresse_modal = create_adresse_modal

             $scope.before_step_finish = function(){
               $scope.third_part_annonce_modal.close()
              // $scope.show_created_location_on_map();

             }

             $scope.show_created_location_on_map = function(){
               }
             $scope.third_part_init = function(){

                 $scope.loadMap({scope:$scope , third : true},$scope.third_part_callback);

             }

             $scope.step_next = function(){

               $scope.etape_creation += 1
               // call send data
               if($scope.etape_creation == 3){

                 $scope.enregistrer_third_after({
                   auth : $scope.auth_third_part($scope.user)
                 });
               }
             }

             $scope.auth_third_part = function(u){
               return "kerawa_"+u.email ;
             }

             $scope.step_prev = function(){

               $scope.etape_creation -= 1;
             }
             $scope.step_checked = function(i){
               if($scope.etape_creation > i){
                 return "checked";
               }
               if($scope.etape_creation == i){
                 return "active";
               }

             }
             $scope.step_active = function(i){

               if($scope.etape_creation == i){
                 return "active";
               }

             }

           $scope.validate_location = function(){
             return ($scope.localisation.name == undefined || $scope.localisation.mairie == undefined);
           }
           $scope.validate_information = function(){
             if($scope.user == undefined ){
               return true
             }else{
               return ($scope.user.pseudo == undefined || $scope.user.email == undefined || $scope.user.phone == undefined);
               }
           }

            $scope.disable_step = function(){

                 if($scope.etape_creation == 0){
                   if ($scope.localisation == undefined){
                     return true;
                   }else{
                     return $scope.localisation.building_id == undefined;
                   }
                 }
                 if($scope.etape_creation == 1){

                   return $scope.validate_location();
                 }

                 if($scope.etape_creation == 2){
                   return $scope.validate_information();
                 }


            }

           $scope.step_finish = function (dom_id){
            var value = angular.element(document.querySelector('#'+dom_id))
            if(value){
              value[0].options.add(new Option($scope.current_adresse.location_address,$scope.current_adresse.location_id,'selected'))
                    }
                 }

            $scope.show_init_location_search = function(){

                if($scope.not_founded_localisation){
                  return false;
                }


                 if($scope.disable_step()){
                   return ($scope.init_location_search);
                 }else{
                   return false;
                 }


            }

            $scope.get_type = function(type){
              var prive = type["prive"];
              var publique = type["publique"]
                 if(prive){
                   return "00";
                 }
                 if(publique){
                   return "01";
                 }
            }

            $scope.get_nature = function(nature){
              var bureau = type["bureau"],
                   domicile = type["domicile"],
                   commerce = type["commerce"]

                 if(bureau){
                   return "B";
                 }
                 if(domicile){
                   return "D";
                 }
                 if(commerce){
                   return "C";
                 }
            }


            $scope.enregistrer_third_after = function(obj){
               // creer et enregistrer une localisation
                 $scope.current_adresse = undefined
                 Restangular.all("road_buildings.json").post(
                   {road_building: {
                               building_id: $scope.localisation.building_id ,
                               road_id: $scope.localisation.road_id ,
                               position: $scope.localisation.position
                         },
                    location:{
                      quartier:$scope.place_point[10]+"_"+$scope.place_point["10_id"],
                      arrondissement:$scope.place_point[8]+"_"+$scope.place_point["8_id"],
                      departement:$scope.place_point[6]+"_"+$scope.place_point["6_id"],
                      region:$scope.place_point[4]+"_"+$scope.place_point["4_id"],
                      rue:$scope.proche.name+"_"+$scope.proche.id,
                      building:$scope.localisation.building_id,
                      mairie: $scope.localisation.mairie,
                      lng:   $scope.localisation.lng,
                      lat:   $scope.localisation.lat,
                      user_id: 0 ,
                      guest:obj.auth,
                      created_nodes:JSON.stringify($scope.element.getLatLngs()),
                      position:($scope.localisation.position == 0 ? 0 : $scope.localisation.position / Math.abs($scope.localisation.position))
                    },
                    place:{
                      name:$scope.localisation.name ,
                      description: $scope.localisation.description ,
                      user_id : 0 ,
                      rubrique:$scope.localisation.rubrique,
                      place_type:   $scope.get_type($scope.localisation.type),
                      nature:   $scope.get_nature($scope.localisation.nature),
                      auth_id:0
                    }
               }
             ).then(function(c){

                        c.location_points = JSON.parse(c["location_points"])
                        console.log(c)
                        $scope.current_adresse = c
                        $scope.$emit("ealo-adresse-created" , c)


                 }, function(error){console.log(error)})

            }

            $scope.$on("ealo-subdvision-selected", function(e,v){
              e.stopPropagation();
              if( $scope.ealo_adresse_current_line){
                 $scope.ealo_adresse_current_line.removeFrom($scope.map)
              }
              $scope.ealo_adresse_current_line = L.polyline(v.points,{color:"#336699"})
              $scope.ealo_adresse_current_line.addTo($scope.map)
            })


      }] ;
  return {
    templateUrl: '/app/templates/modals/module_adresse_2.html',
    bindToController : true,
    controllerAs : 'ctrl',
    controller : controller
  }
}]) ;
