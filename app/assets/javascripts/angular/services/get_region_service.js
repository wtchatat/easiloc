

angular.module('app')
        .factory('svrGetRegion' , ['Restangular', function (Restangular) {

        return {
            getRegions: function (fn) {
              Restangular.one("cities.json").get().then(function(e){
                    fn(e);
              },function(error){
                console.log(error)
              })
            },
            getSubRegions : function(regions){
               var filter = this.filterRegions(regions);
               var subregion =[] ;
               subregion = _.flatten([
                 _.map(filter[4]  , function(k,v){ return v + " # Region" ;}) ,
                 _.map(filter[6]  , function(k,v){ return v + " # Departement" ;}) ,
                 _.map(filter[8]  , function(k,v){ return v + " # Arrondissement" ;}) ,
                 _.map(filter[10] , function(k,v){ return v + " # Quartier" ;})
                 ])
              return subregion ;


            },
            filterRegions : function(regions){
              var filter = {};
              for(var i= 2 ; i < 11 ; i++){
                filter[i] = {};
              }
              var len = regions.length ;
            for(var i = 0 ; i < len ; i++){
              filter[regions[i]["level"]][regions[i]["nom"].trim()] = {"center" : regions[i]["center"]  , "cog" : regions[i]["cog"] , "points" :regions[i]["points"]  }
            }
              return filter;
            }

        };
    }])
