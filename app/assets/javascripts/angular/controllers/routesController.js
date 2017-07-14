angular.module('app')
 .controller('RoutesController',[ '$scope' , '$state','$stateParams', 'leafletData','$uibModal', 'Restangular','$filter' , 'osmOverpassAPI','$compile','$http',function($scope , $state , $stateParams, leafletData ,$uibModal,Restangular,$filter,osmOverpassAPI,$compile,$http){

        var state_name = $state.current.name ;
        var action = $stateParams.action ;
        $scope.start_depart = true ;
         $scope.link = "hello"

      //  $scope.principal = $scope //var leafletData = arguments[3] ;
        $scope.loadMap = function(){

          leafletData.getMap().then(function(map){
            $scope.map = map

             if (action == "positionne"){
               map.zoomControl.remove();
             }
              map.setView([3.86785, 11.52088], 16);


          if ($stateParams.action == "partage"){
            $scope.partage_show(location.href.split("?")[1].split("=")[1])
          }
          })
            $scope.initialize_data()

         }
           $scope.onChange = function(){




           }


           $scope.partager = function(s){
                  $scope.share_link = s
                 // create localisation
                 // Link for sharing this view
                 $uibModal.open({
                   templateUrl: 'app/templates/modals/partage_route.html',
                   //scope : $scope ,
                   size : 'md',
                   controller : "PartageController",
                   resolve :  {
                     location_share : function(){
                       return  $scope.share_link;
                     }
                   }
                 })
           }

           $scope.partage_show = function(s){
             var link =s
             var places = link.split(";")
             var wp = places[0].split("#")
              var depart = wp[0].split("@")

             var arrive = wp[1].split("@")
            var  location = places[1].split("!")
             $http({
         method: 'GET',
         url: "locations/"+location[0]+".json"
       }).then(function(c){
         console.log(c)
                 var c = c.data
                 var line =   L.polygon(JSON.parse(c.points),{color:"#003366"}).addTo($scope.map)
               .bindPopup("<strong>" + c.name +"</strong>" + "<br/>" +c.address)
               .openPopup();
             })
             $http({
         method: 'GET',
         url: "locations/"+location[1]+".json"
       }).then(function(c){
                 var c = c.data
                 var line =   L.polygon(JSON.parse(c.points),{color:"#003366"}).addTo($scope.map)
               .bindPopup("<strong>" + c.name +"</strong>" + "<br/>" +c.address)
               .openPopup();
             })
             var control =  L.Routing.control({
                  containerClassName:"results",
                   language: 'fr',
       waypoints: [
       L.latLng(depart[0], depart[1]),
       L.latLng(arrive[0], arrive[1])
       ],
        routeWhileDragging: true,
        reverseWaypoints: true,
        fitSelectedRoutes: true
       });

       var routeBlock = control.onAdd($scope.map);
       document.getElementById('routing_results').appendChild(routeBlock);


           }


           $scope.initialize_data = function(d){

            //  var actuel_query = d
            //    if (d == $scope.actuel_query){
            //      return $scope.actuel_data
            //    }
               Restangular.all("locations/search.json").post().then(function(c){
                  $scope.locations = c ;

                //  $scope.locations = _.map(c,function(k){ return k.address})
               },

               function(error){
                 console.log(error)
               }
             )
           }

         $scope.search=function(){

        var control =  L.Routing.control({
             containerClassName:"results",
              language: 'fr',
waypoints: [
  L.latLng($scope.depart.lat, $scope.depart.lng),
  L.latLng($scope.arrive.lat, $scope.arrive.lng)
],
   routeWhileDragging: true,
   reverseWaypoints: true,
   fitSelectedRoutes: true
});

var routeBlock = control.onAdd($scope.map);
document.getElementById('routing_results').appendChild(routeBlock);
$scope.link = $scope.depart.lat+"@"+ $scope.depart.lng+"#"+ $scope.arrive.lat +"@"+ $scope.arrive.lng +";" + $scope.depart.id +"!" + $scope.arrive.id
  // var partageBlock = "<button class='btn btn-default' ng-click='partager("+link+")'></button>"
  //    partageBlock = $compile(partageBlock)($scope)[0]
  // document.getElementById('routing_results').appendChild(partageBlock);


         }

       $scope.loadMap();

}])
