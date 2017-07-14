angular.module('app')
 .filter('short_user', function(){
   var shortUser = function(name){
       if (angular.isUndefined(name)){
         return name
       }
      var result = name.split(",") ;
        if (result.length == 1){
          return name ;
        }
        return result[1]
   }
   return shortUser ;
 })
 .filter('localisation_type', function(){
   var locType = function(name){
      if(angular.isUndefined(name)){
        return name;
      }
    var result = name.split(" ")
    return result[0] ;
   }

   return locType ;

 })
 .filter('localisation_acces', function(){
   var locAcces = function(name){
      if(angular.isUndefined(name)){
        return name;
      }
    var result = name.split(" ")
    return result[1] ;
   }

   return locAcces;

 }).filter('adresse_show',function(){
    var adresse = function(obj){
      if(angular.isUndefined(obj)){
        return obj
      }
      var adresses = [];
      angular.forEach(obj,function(e){
        adresses.push(e["texte"])
      })
      return adresses
    }
 })
