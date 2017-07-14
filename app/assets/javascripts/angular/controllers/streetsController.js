angular.module('app')
 .controller('StreetsController',
 ['$scope' , '$state','$stateParams', 'leafletData','$uibModal', 'Restangular','$filter',
     function($scope , $state , $stateParams, leafletData ,$uibModal,Restangular,$filter){




                $scope.loadMap = function(){

                   leafletData.getMap().then(function(map){
                   $scope.map = map
                    map.setView([3.86785, 11.52088], 16);
                    var all_points =[]
                  Restangular.one("streets.json").get().then(function(c){
                   var points = c["all_points"]

                         L.polyline(points,{fillColor:"red"}).addTo($scope.map)
                         .bindPopup(c["ttext"])
                         .openPopup();

                      })

                     //$scope.positionne()
                 })
              }

              $scope.$on('leafletDirectiveMap.contextmenu', function(event,e){

                     Restangular.one("streets.json?lat="+e.leafletEvent.latlng.lat+"&lng="+e.leafletEvent.latlng.lng).get().then(function(c){
                    // _.each(c,function(e,i){
                    //   var element = e ;
                    //   var  all_point = []
                    //           var s = e["points"].split(";");
                    //       while(s.length > 0){
                    //         all_point.push(s.splice(0,2))
                    //       }
                    //     _.each(all_point, function(ele,ind){
                    //
                    //     )}
                    //    var _color = '#'+Math.floor(Math.random()*16777215).toString(16) ;
                    //                L.polyline(points,{color:_color}).addTo($scope.map)
                    //     })

                     })
                 });


    $scope.loadMap() ;

  } ])
