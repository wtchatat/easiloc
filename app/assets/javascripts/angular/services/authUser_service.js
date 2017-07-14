(function(){
var module_name = ['app' , 'app-contact'] ;
for(var i = 0 ; i < module_name.length ; i++ ) {
angular.module(module_name[i])
   .factory('svrUser', ['Restangular', function (Restangular) {

        var _user = {};

        return {
            requestCurrentUser: function (fn) {
              Restangular.one("users/active_user.json").get().then(function(e){
                fn(e);
              },function(error){
                console.log(error)
              })
            }


        };
    }])
}
})();
