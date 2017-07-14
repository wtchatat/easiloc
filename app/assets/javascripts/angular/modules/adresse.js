/* module adresse pour creer les adresses ELadresse */
 angular.module('ELadresse',[])
 .directive('elStepAdresse',function(){
   return {
    restrict: 'E',
    template : '<div class="row show_step" ng-show = "etape_creation < 3 ">'+
    '<div class="col-xs-4 step" ng-class="step_active(0)">'+
    '<span ng-class="step_checked(0)"> 1 <i ng-show=" etape_creation > 0 " class="fa fa-check"></i></span>'+
    '</div><div class="col-xs-4 step" ng-class="step_active(1)">'+
    '<span ng-class="step_checked(1)"> 2 <i ng-show=" etape_creation > 1 " class="fa fa-check"></i></span>'+
    '</div><div class="col-xs-4 step" ng-class="step_active(2)">'+
    '<span ng-class="step_checked(2)"> 3 <i ng-show=" etape_creation > 2 " class="fa fa-check"></i>'+
    '</span></div></div>',
    controller:'LocalisationsController'
    }
 })
 .directive('elAdresse',function(){
   return {
    restrict: 'E',
    templateUrl: '../templates/adresse.html',
    controller:'LocalisationsController'
    }
 })
 .provider('ELadresse',function(){

   var $adresseProvider = {
     options:{
       types:["prive" , "public" ] ,
       categories:[
         "bar","restaurant","restaurant rapide" , "glacier" , "ecole" , "crêche", "Institut superieur","librairie","centre d'apprentissage","université","laverie","location vehicules",
         "gare routiere","parking","Banque-DAB","DAB","banque","bureau de change","centre culturel","salle de jeux","salle de fêtes","salle de cinema", "boite de nuit",
         "foyer social","toilette publique","clinique","cabinet dentaire","hopital","centre de santé","pharmacie","veterinaire",
         "prison","boulangerie","marché","poisonnerie","mairie","gendarmerie","centre de formation","ministere","delegation ministerielle",
         "magasin-electromenager","magasin-pret à porter","magasin-jouets","magasin","commisariat","Salon de coiffure","Quincaillerie",
         "sapeur pompier","entreprise"
       ],
       show:false,
       search:true
     },
     $get:['$rootScope', '$q', 'svrOverPass',function($rootScoope,$q,svrOverPass){
      var $adresse = {}
         $adresse.init = function(adresseOptions){
           var adresseNormalDeferred = $q.defer() ;
           var adresseThirdDeferred = $q.defer() ;
           // variable return with init
           var adresseInstance = {
             normal:adresseNormalDeferred.promise,
             third:adresseThirdDeferred.promise
           }
           adresseOptions = angular.extend({}, $adresseProvider.options , adresseOptions);

          function  targetRadius(radius,latlng){
            // radius in meter
               var _query =  "[out:json];way(around:"+radius+","+ latlng.lat+","+latlng.lng+")['building'];(._; >;); out;"
               return _query;
          }

          function preciseRegions(latlng,map){

              var query ="[out:json];is_in("+latlng.lat+","+latlng.lng+"); area._[admin_level] ; out; "
              var query2 = "[out:json];way(around:100,"+latlng.lat+","+latlng.lng+")['highway'~'secondary|primary|residential|trunk|tertiary'];(._; >;); out;"
              //var query3 =  "[out:json];way(around:10,"+latlng.lat+","+latlng.lng+")['building'];(._; >;); out;"

              var place_point = {} ;
              var route = []
              return svrOverPass.requestOsm(query,function(data){
                _.each(data.elements , function(e){
                     place_point[e.tags.admin_level] = e.tags.name
                     place_point[e.tags.admin_level+"_id"] = e.id
                  })
                 $scope.place_point = place_point
                 return svrOverPass.requestOsm(query2,function(data){
                   var element = svrOverPass.getWays(data.elements) ;
                   var points = {}
                   var lines = []
                    _.each(element,function(el,i){ points[i] =  _.map(el.nodes,function(e){
                     return [e.lat , e.lon ] ;
                   }) })
                    var active = null ;
                   _.each(points, function(ele,i){
                           var line =  L.polyline(ele,{color:"#993300" , smoothFactor : 1}).addTo(map) ;
                             line.id = element[i].id
                             line.name = element[i].tags.name
                           lines.push(line) ;

                   })
                   var proche = L.LineUtil.proche(lines,latlng) ;
                   var orientation = L.LineUtil.pointOrientation(proche.line,latlng)
                     return{
                       lines : lines,
                       procheLine : proche.line,
                       orientation : orientation[1]
                     };
              });

            })

          }


          $scope.loadMap = function(map){
                 map.zoomControl.remove()
              // ajoute le menu contextual
                  var mapMenu = new L.Map.ContextMenu(map)
              // verifie si je clique de la carte principale
             map.setView([3.86785, 11.52088], 16);
             mapMenu.addItem({ text: 'Creer une addresse', callback: function(e){$scope.create_addresse(e,obj) } })
           mapMenu.addHooks()
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




           // latlng and map using to target point a show reponse
           function getTargetinfo(latlng,map){
                   var query =  targetRadius(50,latlng);
                       map.zoomControl.remove();
                       map.setView([latlng.lat, latlng.lng], 18);
                      return svrOverPass.requestOsm(query,function(data){

                      adresseOptions.show = true ;
                      var element = svrOverPass.getWays(data.elements) ;
                      var points = {}
                       _.each(element,function(el,i){ points[i] =  _.map(el.nodes,function(e){
                             return [e.lat , e.lon ] ;
                              })
                       })
                       var active = null ;
                       var polygons = [] ;

                      _.each(points, function(ele,j){
                        var polygon_interne = L.polygon(ele,{color:"#00bb00" , smoothFactor : 1})
                        var inside = isMarkerInsidePolygon(polygon_interne,latlng)
                        if(inside){
                               polygons.push({poly:polygon_interne , id : j})
                          }
                        })

                         //var filter_poylgons = $scope.check_inside(polygons,$scope.localisation)
                              var found_element = undefined ;
                              if(polygons.length < 1){
                                   found_element= undefined ;
                              }else{
                                var precise = preciseRegions(latlng , map)
                                var i = polygons[0]["id"]
                                var polygon = polygons[0]["poly"].addTo(map)
                                found_element ={
                                  polygon : polygon ,
                                  element : element[i]
                                     }
                                }

                            return {
                              foundElement : found_element
                            };
                        })
                    }

          // put element on dom
          }
     }]

   };

   return $adresseProvider;
 });
