angular.module('app', ['ngAnimate','ui.router','ui.bootstrap','leaflet-directive','ui.select','ngSanitize' , 'restangular' ,'osm.overpass','angular-clipboard','cgNotify','ngImgCrop','chart.js','ngFileUpload']) ;
// for compatibility with Rails CSRF protection
/*angular.module('app').config([   '$httpProvider',
function($httpProvider){
     $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')
      }
    ]);
*/
