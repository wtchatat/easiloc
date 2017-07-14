
angular.module('app-contact')
.config([ '$httpProvider',
function($httpProvider){

     $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')
      }
    ])
.config(function($stateProvider,$urlRouterProvider,$locationProvider){

  $stateProvider
       .state('home',{
       url: '/' ,
       views:{
         'container' : {
       templateUrl : "/home/app/templates/iframe.html",
       controller :"IframesController"
       }
       }
     })

     $urlRouterProvider.otherwise('/');

    // enable HTML5 Mode for SEO
    //$locationProvider.html5Mode(true);
})
