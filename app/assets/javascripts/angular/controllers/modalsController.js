angular.module('app')
.controller('ModalController', ['$scope','$uibModal','leafletData', 'current_place' ,'$uibModalInstance' , 'osmOverpassAPI', 'Restangular', '$compile','$rootScope','svrOverPass', function($scope,$uibModal,leafletData,current_place,$uibModalInstance,osmOverpassAPI,Restangular,$compile,$rootScope,svrOverPass){
   $scope.show = false;
  $scope.localisation = {} ;
  $scope.types = ["prive" , "public" ]
  $scope.categories = [
    "bar","restaurant","restaurant rapide" , "glacier" , "ecole" , "crêche", "Institut superieur","librairie","centre d'apprentissage","université","laverie","location vehicules",
    "gare routiere","parking","Banque-DAB","DAB","banque","bureau de change","centre culturel","salle de jeux","salle de fêtes","salle de cinema", "boite de nuit",
    "foyer social","toilette publique","clinique","cabinet dentaire","hopital","centre de santé","pharmacie","veterinaire",
    "prison","boulangerie","marché","poisonnerie","mairie","gendarmerie","centre de formation","ministere","delegation ministerielle",
    "magasin-electromenager","magasin-pret à porter","magasin-jouets","magasin","commisariat","Salon de coiffure","Quincaillerie",
    "sapeur pompier","entreprise"
  ]
 $scope.current_place = current_place ;
 $scope.localisation.lat = current_place.lat ;
 $scope.localisation.lng = current_place.lng ;

  var query3 =  "[out:json];way(around:50,"+ $scope.localisation.lat+","+$scope.localisation.lng+")['building'];(._; >;); out;"
  leafletData.getMap().then(function(map){
     $scope.map = map
      map.zoomControl.remove();
      map.setView([$scope.current_place.lat, $scope.current_place.lng], 18);
    //  L.marker([$scope.current_place.lat, $scope.current_place.lng],{draggable : true }).addTo(map)
     //.bindPopup('position encours...')
  //.openPopup();
  svrOverPass.requestOsm(query3,function(data){

        $scope.show = true ;
    // retrouve la maison la plus proche definit clique sur la maison que l'on estime que c'est a notre
        var element = svrOverPass.getWays(data.elements) ;
      //  console.log(element)
        var points = {}
         _.each(element,function(el,i){ points[i] =  _.map(el.nodes,function(e){
          return [e.lat , e.lon ] ;
        }) })
         var active = null ;
        var polygons = [] ;

        _.each(points, function(ele,j){
          var polygon_interne = L.polygon(ele,{color:"#993300" , smoothFactor : 1})
              var inside = $scope.isMarkerInsidePolygon(polygon_interne,$scope.localisation)
              if(inside){
                 polygons.push({poly:polygon_interne , id : j})
              }
        })

                //var filter_poylgons = $scope.check_inside(polygons,$scope.localisation)
                var i = polygons[0]["id"]
                var polygon = polygons[0]["poly"].addTo(map)
               //polygon.on("click",function(el){
                 // si le polygone est unique gere directement sinon attend
                 //  $scope.element = el.target
                    $scope.element = polygon
                    $scope.parent_scope = $rootScope
                    $scope.element.bindPopup($compile('<div>Annulez cette selection <br/><a style="color:#fff" ng-click="remove_selection(parent_scope)" class="btn btn-warning btn-xs"><i class="fa fa-close"></i> Annuler </a></div>')($scope)[0])
                   $scope.localisation.building_id = element[i].id
                 $scope.localisation.name = element[i].tags.name
                  $scope.localisation.categorie = element[i].tags.amenity
                  //  if (active){
                  //    active.setStyle({color:"#993300"})
                  //  }
                  //  el.target.setStyle({color:"#003399"})
                  //  var popupel ="<h3>"+ element[i].type +":"+ element[i].id + "</h3><br/>";
                  //    _.each(element[i].tags,function(t ,i){
                  //      popupel += i + ":" + t +"<br/>"
                  //    })
                  //  el.target.bindPopup(popupel).openPopup();

                   //active = el.target ;

               //})

  //})
 })
  $scope.regions(current_place, map)

});
 $scope.remove_selection = function(s){
     _.each($scope.lines,function(el,i){
       el.removeFrom($scope.map);
     })
     $scope.element.removeFrom($scope.map);
     $scope.fermer();
 }
  $scope.fermer = function(){
      //  $scope.positionne(null,$scope.principal)


        $uibModalInstance.close($scope.localisation)
  }
 $scope.close_partage_exist = function(){
   $scope.modal_instance_exist.close()
 }
 $scope.close_partage_notexist = function(){
   $scope.modal_instance_notexist.close()
 }
  $scope.enregistrer = function(){
    // verifie si la maison est deja cree
    Restangular.one("/locations/partage/"+$scope.localisation.building_id+".json").get().then(function(data){
    if(data.length > 0){
      console.log(data[0].user_id)
        console.log(data[0].user_id != null)
    $scope.user_exit  = (data[0].user_id != null)

    $scope.modal_instance_exist = $uibModal.open({
         templateUrl: 'app/templates/modals/create_addresse_existing.html',
         size : 'sm',
         windowTopClass:"partage",
         controller : "ModalController",
         resolve :  {
           current_place : function(){
             return $scope.localisation;
           }
         }
       });

    }else{
      $scope.modal_instance_notexist = $uibModal.open({
           templateUrl: 'app/templates/modals/create_addresse_notexisting.html',
           size : 'sm',
           windowTopClass:"partage",
           controller : "ModalController",
           resolve :  {
             current_place : function(){
               return $scope.localisation;
             }
           }
         });


    }
    },function(error){

    })
  }


  $scope.enregistrer_after = function(){
     // creer et enregistrer une localisation

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
            name: $scope.localisation.name ,
            description: $scope.localisation.description ,
            type_id:   $scope.localisation.type,
            mairie: $scope.localisation.mairie,
            lng:   $scope.localisation.lng,
            lat:   $scope.localisation.lat,
            user_id: 1,
            created_nodes:JSON.stringify($scope.element.getLatLngs()),
            position:($scope.localisation.position == 0 ? 0 : $scope.localisation.position / Math.abs($scope.localisation.position))
          }
     }
   ).then(function(c){
               console.log(c)
         var addr ="<div>"+ c.pid + "#" + $scope.proche.name + "<br/>" + $scope.localisation.mairie +"<br/>"+$scope.place_point[10]+";"+ $scope.place_point[8] + "<br/>" +  $scope.place_point[6] +  ";" +  $scope.place_point[4]
              addr += "<hr/><div class='routing_tools'><a  href='#' uib-popover='favoris' popover-trigger='mouseenter' popover-placement='bottom' ng-click='add_location_favourite("+$scope.localisation.building_id+","+ c.location_id+")'><i class='fa fa-map-pin'></i></a><a href='#' uib-popover='partager' popover-trigger='mouseenter' popover-placement='bottom' ng-click=partage_location("+$scope.localisation.building_id+")><i class='fa fa-share-alt'></i></a></div></div>"
              addr = $compile(addr);

        line= L.polygon($scope.element.getLatLngs()).addTo($rootScope.current_scope.map)

        line.bindPopup(addr($rootScope.current_scope)[0]).openPopup();
        // Donner le nom de la rue

       }, function(error){console.log(error)})
       $uibModalInstance.close($scope.localisation)
  }

  $scope.partager = function(s){
         $scope.share_link = s
        // create localisation
        // Link for sharing this view
        $uibModal.open({
          templateUrl: 'app/templates/modals/partage.html',
          scope : $scope ,
          size : 'sm',
          controller : "LocalisationsController",
        })
  }

  $scope.regions = function(latlng,map){
    var query ="[out:json];is_in("+latlng.lat+","+latlng.lng+"); area._[admin_level] ; out; "
    var query2 = "[out:json];way(around:100,"+latlng.lat+","+latlng.lng+")['highway'~'secondary|primary|residential|trunk|tertiary'];(._; >;); out;"
    //var query3 =  "[out:json];way(around:10,"+latlng.lat+","+latlng.lng+")['building'];(._; >;); out;"

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
                 var line =  L.polyline(ele,{color:"#993300" , smoothFactor : 1}).addTo(map) ;
                   line.id = element[i].id
                   line.name = element[i].tags.name
                 lines.push(line) ;
                line.on("click",function(el){
                    el.target.setStyle({color:"#003399"})
                    var popupel ="<h3>"+ element[i].id + "</h3><br/>";
                      _.each(element[i].noms,function(t ,i){
                        popupel += i + ":" + t +"<br/>"
                      })
                    el.target.bindPopup(popupel).openPopup();
                    })


         })
         var proche = L.LineUtil.proche(lines,latlng) ;
         var orientation = L.LineUtil.pointOrientation(proche.line,latlng)
          $scope.lines = lines
           proche.line.setStyle({color:"#17b751"})
           $scope.proche = proche.line
           $scope.localisation.road_id =proche.line.id
           $scope.localisation.position  = orientation[1]
    });

  })
  }

  $scope.isMarkerInsidePolygon = function ( poly,p) {
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

$scope.check_inside = function(polygon,p){
  var polys = []
  _.each(polygon,function(poly,e){
      var inside = poly["poly"].getBounds().contains(L.latLng(p.lat, p.lng))
      if(inside){
        polys.push(poly)
      }
  })

  // si inisde est vrai approfondir avec raster
    return $scope.filter_check_inside(polys);
}
$scope.filter_check_inside = function(polys){
  // filter if we have polys.length > 1
  console.log( polys[0]["poly"].getLatLngs()) ;

console.log( L.PolyUtil.geodesicArea(polys[0]["poly"].getLatLngs()[0])) ;
if(polys.length < 2){
    return polys;
}
// return $scope.order_check_inside(polys);
}

$scope.order_check_inside = function(polygons){
  var polys = polygons
  var i = 1
  var active = polys[0]
  for(var j = 1 ; j < polys.length ; j++){
  if (Polygon.plus_petit(polys[j]["poly"],active["poly"])){
    active = poly[j]
   }
  }
  polys[0] = active
  return polys;
}

}])
