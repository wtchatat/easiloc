
angular.module('app')
  .controller('NavigationController',[ '$scope' , '$state','$stateParams',function($scope , $state , $stateParams){

          $scope.message = function(){
             alert("click")
          }


          // une fonction qui verifie si on veut creer une location, en ce moment un modal s'ouvre pour
          // dire qu'il vous à l'aide de la carte selectionner la position de votre site et suivre les instructions

          $scope.$on('$stateChangeStart' , function(event, toState,toParams, fromState,fromParams){

          })
          $scope.$on('$stateChangeSuccess' , function(event, toState,toParams, fromState,fromParams){

          })




      }])
  .controller('NavListCtrl',[ '$scope' , function($scope){
    $scope.oneAtATime = true;
    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    }
  }])
  .controller("PartageController",[ '$scope','localisation', 'current_place' , 'leafletData' , function($scope,localisation,current_place,leafletData){
     $scope.localisation = localisation ;
     $scope.current_place = current_place ;
     $scope.users = [ "william TCHATAT , wtchatat@gmail.com" , "hortence BELEBENIE , lajacobe@yahoo.fr"]
    $scope.share={
       link : "localhost/localisation/view?DHNNKLIUEBPOOIU"
     }
      console.log(current_place )
      $scope.shares = [ "public" , "prive"]
      $scope.accesses = [ "lecture" , "commentaire" , "modification"]
      leafletData.getMap($scope).then(function(map){
          map.zoomControl.remove();
          map.setView([$scope.current_place.lat, $scope.current_place.lng], 18);
          L.marker([$scope.current_place.lat, $scope.current_place.lng],{draggable : true }).addTo(map)
      .bindPopup('position partage')
      .openPopup();  })
  }])
  .controller("RoutesController",[ '$scope', function($scope){


  }])
  .controller("AroundController",[ '$scope', function($scope){

  $scope.categories = ["Vehicules","Emploi","Immobilier","Vacances","Multimedia","Maison","Loisirs","Service","Habillement"]
  $scope.distances = ["1 km","10 km","100 km","Tout"]

  }])
