angular.module('app')
 .controller('PartageController',
 ['$scope' , '$state','$stateParams', 'leafletData','$uibModal', 'Restangular','$filter','location_share',
     function($scope , $state , $stateParams, leafletData ,$uibModal,Restangular,$filter,location_share){
              console.log($state)
              console.log($stateParams)
               $scope.location_share ="http://localhost:3000/#/"+$state.current.name+"/partage?p="+ location_share


                 $scope.fermer = function(){
                     //  $scope.positionne(null,$scope.principal)

                       $uibModalInstance.close($scope.location_share)
                 } ;
                 // clipboard
                 $scope.success = function () {
                           $scope.success_message = "Le lien est copié dans le presse-papier";
                           };

                   $scope.fail = function (err) {
                     $scope.error_message = "Erreur survenu:"+ err;

                };



  } ])
