angular.module('app')
.controller('AssocierController', ['$scope','$uibModal','leafletData', 'current_place' ,'$uibModalInstance' , 'osmOverpassAPI', 'Restangular', '$compile','$rootScope','svrUser','svrLocation','svrOverPass', function($scope,$uibModal,leafletData,current_place,$uibModalInstance,osmOverpassAPI,Restangular,$compile,$rootScope,svrUser,svrLocation,svrOverPass){
   $scope.show_associer = false;
  $scope.localisation = {} ;
  $scope.message = " Selectionner le lieu en surbrillance par un clique droit"
 $scope.current_place = current_place ;
 $scope.localisation.lat = current_place.lat ;
 $scope.localisation.lng = current_place.lng ;
//console.log($scope.localisation.lng)
  var query3 =  "[out:json];way(around:10,"+ $scope.localisation.lat+","+$scope.localisation.lng+")['building'];(._; >;); out;"
  leafletData.getMap($scope).then(function(map){
     $scope.map = map ;
     //map.contextmenu = true;
      map.zoomControl.remove();
      map.setView([$scope.current_place.lat, $scope.current_place.lng], 16);
    //  L.marker([$scope.current_place.lat, $scope.current_place.lng],{draggable : true }).addTo(map)
     //.bindPopup('position encours...')
  //.openPopup();
  svrOverPass.requestOsm(query3,function(data){

    $scope.show_associer = true ;
// retrouve la maison la plus proche definit clique sur la maison que l'on estime que c'est a notre
    var element = svrOverPass.getWays(data.elements) ;
    var points = {}
     _.each(element,function(el,i){ points[i] =  _.map(el.nodes,function(e){
      return [e.lat , e.lon ] ;
    }) })
     var active = null ;
     var take_points = _.map(element, function(e){return e.id})
  //  console.log(take_points)
        Restangular.all("locations/filter.json").post({
      points: _.map(element, function(e){return e.id})
    }).then(function(data){
        _.each(data,function(e){
          var points = JSON.parse(e.points)
          var polygone = L.polygon(points,{
          color: "#993300",
          contextmenu: true,
          location_id: e.id ,
          contextmenuInheritItems: true,
          contextmenuItems: [{
              text: 'enregistrer comme domicile',
              callback: function(e){
                //add_lieu_domicile
                $scope.domicile(e.relatedTarget.options.location_id)

              } },
              {
                  text: 'enregistrer comme lieu de travail',
                  callback: function(e,p){
                    //add_lieu_travail(e)
                    console.log(p)
                 }}
          ]
          })
          polygone.addTo($scope.map).bindPopup(e.address)
        })

    } , function(error){
          console.log(error)
    })
   })
  });
  $scope.fermer = function(){
          $uibModalInstance.close($scope.localisation)
  } ;

  $scope.domicile = function(id){
    svrUser.requestCurrentUser(function(e){
      // verifie si ce domicile à deja attribue
      svrLocation.getUser(id,function(u){
        // if  (u.id == null){
        //   // pas proprietaire
        //   console.log("enregistre domicile")
          svrLocation.setUser(id , e.id , "domicile")
        // }
        // else{
        //   if (u.id == e.id){
        //     console.log("Vous avez deja associé cette maison avec cet utilisateur")
        //     }else{
        //     console.log(" Ce lieu est deja associe à une autre personne")
        //   }
        // }
      })
      console.log("domicile N°: "+ id)
      console.log("apparatient à "+ e.id +" name:" + e.email )
    })

  }

}])
