angular.module('app')
.controller('AdresseController', ['$scope','$uibModal','leafletData', 'current_place' ,'$uibModalInstance' , 'osmOverpassAPI', 'Restangular', '$compile','$rootScope', function($scope,$uibModal,leafletData,current_place,$uibModalInstance,osmOverpassAPI,Restangular,$compile,$rootScope){
   $scope.show = false;
  $scope.localisation = {} ;
  // $scope.types = ["prive" , "public" ]
  // $scope.categories = [
  //   "bar","restaurant","restaurant rapide" , "glacier" , "ecole" , "crêche", "Institut superieur","librairie","centre d'apprentissage","université","laverie","location vehicules",
  //   "gare routiere","parking","Banque-DAB","DAB","banque","bureau de change","centre culturel","salle de jeux","salle de fêtes","salle de cinema", "boite de nuit",
  //   "foyer social","toilette publique","clinique","cabinet dentaire","hopital","centre de santé","pharmacie","veterinaire",
  //   "prison","boulangerie","marché","poisonnerie","mairie","gendarmerie","centre de formation","ministere","delegation ministerielle",
  //   "magasin-electromenager","magasin-pret à porter","magasin-jouets","magasin","commisariat","Salon de coiffure","Quincaillerie",
  //   "sapeur pompier","entreprise"
  // ]
 $scope.current_place = current_place ;
 $scope.localisation.lat = current_place.lat ;
 $scope.localisation.lng = current_place.lng ;

  var query3 = "[out:json];way(around:100,"+latlng.lat+","+latlng.lng+")['highway'~'secondary|primary|residential|trunk|tertiary'];(._; >;); out;"

    leafletData.getMap($scope).then(function(map){
      map.zoomControl.remove();
      map.setView([$scope.current_place.lat, $scope.current_place.lng], 18);
      L.marker([$scope.current_place.lat, $scope.current_place.lng],{draggable : true }).addTo(map)
     //²1.bindPopup('position encours...')
  //.openPopup();
  osmOverpassAPI.overpass(query3).then(function(data){
         console.log(data)


  }, function(error){console.log(error)})

  $scope.regions(current_place, map)

});
  $scope.fermer = function(){
      //  $scope.positionne(null,$scope.principal)


        $uibModalInstance.close($scope.localisation)
  } ;
  $scope.enregistrer = function(){
     // creer et enregistrer une localisation
    console.log(JSON.stringify($scope.element.getLatLngs())) ;
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
            created_nodes:JSON.stringify($scope.element.getLatLngs()),
            position:($scope.localisation.position == 0 ? 0 : $scope.localisation.position / Math.abs($scope.localisation.position))
          }
     }
   ).then(function(c){

         var addr ="<div>"+ c.pid + "#" + $scope.proche.name + "<br/>" + $scope.localisation.mairie +"<br/>"+$scope.place_point[10]+";"+ $scope.place_point[8] + "<br/>" +  $scope.place_point[6] +  ";" +  $scope.place_point[4]
              addr += "<hr/>+<a ng-click='partager("+$scope.localisation.building_id+")'> partager </a></div>"
              addr = $compile(addr);
              console.log($scope)
        line= L.polygon($scope.element.getLatLngs()).addTo($rootScope.current_scope.map)
         console.log($rootScope.current_scope)
        line.bindPopup(addr($rootScope.current_scope)[0]).openPopup();
        // Donner le nom de la rue

       }, function(error){console.log(error)})
       $uibModalInstance.close($scope.localisation)
  }

  $scope.get_nodes = function(data){
    var selected_nodes = _.reject(data, function(e){ return (e.type != "node") ;}) ;
    var nodes = {} ;
    _.each(selected_nodes,function(el){
      nodes[el.id] = el ;
    })
    return nodes;
  }
  $scope.get_ways = function(data){
      var selected_ways = _.reject(data, function(e){ return (e.type != "way") ;}) ;
      var selected_nodes = $scope.get_nodes(data) ;
      var ways = {} ;
      _.each(selected_ways,function(el){
        _.each(el.nodes,function(ele,i){
          el.nodes[i] = selected_nodes[ele]
        })
        ways[el.id] = el ;
      }) ;
      return ways;
  }
  $scope.regions = function(latlng,map){
    var query ="[out:json];is_in("+latlng.lat+","+latlng.lng+"); area._[admin_level] ; out; "
    var query2 = "[out:json];way(around:100,"+latlng.lat+","+latlng.lng+")['highway'~'secondary|primary|residential|trunk|tertiary'];(._; >;); out;"
    //var query3 =  "[out:json];way(around:10,"+latlng.lat+","+latlng.lng+")['building'];(._; >;); out;"

    var place_point = {} ;
    var route = []
    osmOverpassAPI.overpass(query)
    .then(function (data) {
     _.each(data.elements , function(e){
          place_point[e.tags.admin_level] = e.tags.name
          place_point[e.tags.admin_level+"_id"] = e.id
       })
      $scope.place_point = place_point
       osmOverpassAPI.overpass(query2).then(function(data){

         var element = $scope.get_ways(data.elements) ;
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
         proche.line.setStyle({color:"#17b751"})
         console.log(proche.line)
           $scope.proche = proche.line
           $scope.localisation.road_id =proche.line.id
           $scope.localisation.position  = orientation[1]


       },function(error){
             console.log(error)
       })

    }, function (error) {
          console.log(error)
    });

  }

}])
