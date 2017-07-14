angular.module('app')
.config([   '$httpProvider',
function($httpProvider){
     $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')
      }
    ])
.config(function($stateProvider,$urlRouterProvider,$locationProvider){
  $stateProvider
     .state('home',{
       url: '/' ,
       templateUrl : 'app/templates/localisations.html'
     })
     .state('users',{
       url: '/users/:action' ,
       views:{
         'container' : {
       templateUrl : function($stateParams){
         var tpl = $stateParams.action ;
             tpl = "app/templates/users/" + tpl + ".html" ;
         return tpl ;
       },
       controller :"UsersController"
       }
       }
     })
     .state('applications',{
       url: '/applications/:action' ,
       views:{
         'container' : {
           templateUrl :  function($stateParams){
             var tpl = $stateParams.action ;
                 tpl = "app/templates/applications/" + tpl + ".html" ;
             return tpl ;
           },
           controller : "LocalisationsController"


         }
       }
     })
      .state('localisations',{
              url: '/localisations/:action' ,
              views:{
                'container': {
                templateUrl : function($stateParams){
                var tpl = $stateParams.action ;
                    tpl = "app/templates/localisations/" + tpl + ".html" ;
                return tpl ;
              },
              controller :"LocalisationsController"
            }
          }
          })
     .state('routes',{
        url: '/routes/:action' ,
        views:{
          'container':{
            templateUrl: function($stateParams){
              var tpl = $stateParams.action ;
                  tpl = "app/templates/routes/" + tpl + ".html" ;
              return tpl ;
            },
            controller : "RoutesController"
          }
        }
     })
     .state('streets',{
       url: '/streets' ,
       templateUrl : "app/templates/streets/zone.html",
       controller : "StreetsController"
     })
     .state('cities',{
       url: '/cities',
       views:{
       'container': {
         templateUrl : "app/templates/cities/zone.html",
         controller : "CitiesController"
       }
     }

     })
     $urlRouterProvider.otherwise('/localisations/new');

    // enable HTML5 Mode for SEO
    //$locationProvider.html5Mode(true);
})
