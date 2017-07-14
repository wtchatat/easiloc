(function(){
var module_name = ['app' , 'app-contact'] ;
for(var i = 0 ; i < module_name.length ; i++ ) {
angular.module(module_name[i])
        .factory('svrLocation' , ['Restangular', function (Restangular) {

        return {
            getUser: function (loc_id,fn) {
              Restangular.one("locations/get_user/"+loc_id+".json").get().then(function(e){
                fn(e);
              },function(error){
                console.log(error)
              })
            },
            setUser: function(loc_id,user_id,nature){
              Restangular.all("locations/set_user.json").post({
                loc_id : loc_id ,
                user_id : user_id,
                nature : nature
              }).then(function(e){
                console.log(e)
              },function(error){
              console.log(error)
            })
          },
          getLocations: function(user_id,fn){
              Restangular.one("locations/user/"+user_id +".json").get()
              .then(
                function(data){
                  fn(data)
                },function(error){
                  console.log(error)
                })
              }
        };
    }])
  }
  })();
