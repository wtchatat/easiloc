angular.module('app')
.directive('ealoSearch', [function() {

  var controller = ['$scope','svrGetRegion', function ($scope,svrGetRegion) {
           //var self = this ;
           $scope.getRegions = function(){
             svrGetRegion.getRegions(function(regions){
                $scope.subdivision = svrGetRegion.filterRegions(regions)
                $scope.sub_regions = svrGetRegion.getSubRegions(regions)
              })
           }
           $scope.onSelect = function(c,v,b){
              var element = c.split("#")
              var level = 2
               if((element[1].trim()) == "Region"){
                 level = 4
               }
               if((element[1].trim()) == "Departement"){
                 level = 6
               }
               if((element[1].trim()) == "Arrondissement"){
                 level = 8
               }
               if((element[1].trim()) == "Quartier"){
                 level = 10
               }
               element[0] = element[0].trim() ;
               var  position = $scope.subdivision[level][element[0]]
                    position.points = $scope.parse_polygon_points(position["points"])
                   $scope.$emit("ealo-subdvision-selected" , position)


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
           $scope.getRegions();

      }] ;
  return {
    templateUrl: '/app/templates/modals/search.html',
    bindToController : true,
    controllerAs : 'ctrl',
    controller : controller
  }
}]) ;
