angular.module('app')
.directive('ealoPlaceSearch', [function() {

  var controller = ['$scope','Restangular', function ($scope,Restangular) {
           //var self = this ;
           $scope.get_place = function(value){

             return Restangular.one("/locations/search.json?query="+value).get().then(function(data){
              //  var locations = [] ;
              //    angular.forEach(data,function(item){
              //      locations.push(item.texte)
              //    })
              //  return locations ;
              return data;
             }
             , function(error){
               return error;
             }
           )

           }
           $scope.onSelect = function(c,v,b){

                   $scope.$emit("ealo-place-search"+ $scope.ealo_place_name()+"-selected" , c)


           }
           $scope.ealo_place_name = function(){
             var name = $scope.name ;
             if(angular.isUndefined(name)){
               return name
             }
             return "-"+name ;
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
           //$scope.getRegions();

      }] ;
  return {
    templateUrl: '/app/templates/modals/place_search_2.html',
    bindToController : true,
    controllerAs : 'ctrl',
    scope:{
      name: '='
    },
    link: function (scope, element, attrs) {
           scope.name = attrs.name
       },
    controller : controller
  }
}]) ;
