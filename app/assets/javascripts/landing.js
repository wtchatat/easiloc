'use strict';
angular.module('landing',
        [
            "ngSanitize",
            "com.2fdevs.videogular",
            "com.2fdevs.videogular.plugins.controls",
            "com.2fdevs.videogular.plugins.overlayplay",
            "com.2fdevs.videogular.plugins.poster",
            "restangular",
            "ui.bootstrap",
            "720kb.socialshare",
            "angular-svg-round-progressbar"
        ]
    )
    .controller('HomeCtrl',
        ["$sce", function ($sce) {

            this.config = {
                preload: "none",
                sources: [
                    {src: $sce.trustAsResourceUrl("/assets/explainer.mp4"), type: "video/mp4"},
                      ],
                      tracks: [
                          {
                              src: "http://www.videogular.com/assets/subs/pale-blue-dot.vtt",
                              kind: "subtitles",
                              srclang: "en",
                              label: "English",
                              default: ""
                          }
                      ],
                      theme: {
                          url: "https://unpkg.com/videogular@2.1.2/dist/themes/default/videogular.css"
                      },
                plugins: {
                    controls: {
                        autoHide: true
                    },
                     poster: "/assets/vg_poster_easiloc.png"
                }
            };
        }]
    )
    .controller('InviteCtrl',
          ["$scope", function ($scope) {

            $scope.fermer_wait = function(){
               $scope.info_souscription_modal.close()
                }
                $scope.fermer_info = function(){
                  $scope.modalReponse.close();
                }
            $scope.media_share = function(name){

              return name;
            }
    }])  .controller('vipCtrl',
            ["$scope" ,"$rootScope","Restangular", function ($scope,$rootScope,Restangular) {

              Restangular.one('/locations/count_invite.json?secret=78hor0924wi84').get().then(function(value){
                $scope.nombre = value.nombre
                $scope.nb_objectif = 500

                $scope.pourcentage = Math.floor(($scope.nombre / $scope.nb_objectif)*100)
                if(  $scope.pourcentage > 100){
                  $scope.pourcentage = 100
                }
              },function(error){console.log(error)})

         $rootScope.$on("ealo-vip-register",function(event,value){
           $scope.nombre = value.nombre ;
           $scope.nb_objectif = 500
           $scope.pourcentage = Math.floor(($scope.nombre / $scope.nb_objectif)*100)
         })
      }])
    .directive("myStopButton",
        function() {
            return {
                restrict: "E",
                require: "^videogular",
                template: "<div class='iconButton' ng-click='API.stop()'>STOP</div>",
                link: function(scope, elem, attrs, API) {
                    scope.API = API;

                }
            }
        }
    ).directive('ealoSubscription', [function() {

      var controller = ['$scope','Restangular','$uibModal','$rootScope', function ($scope,Restangular,$uibModal,$rootScope) {
               //var self = this ;

               $scope.register = function(){
                 $scope.info_souscription_modal = $uibModal.open({
                      templateUrl: 'app/templates/modals/subscription_info_wait.html',
                      scope : $scope ,
                      size : 'sm',
                      windowClass : "partage" ,
                      controller : "InviteCtrl",
                    })
                 Restangular.all('/locations/landing.json?secret=78hor0924wi84').post({
                 invite:$scope.invite
                 }).then(function(value){
                    $rootScope.$on("ealo-progress-finish",function(){
                      $scope.info_souscription_modal.close() ;
                      $scope.register_response(value)
                    })

                 },function(error){console.log(error)})
               }
               $scope.register_response = function(value){
                 if(value){

                  $rootScope.$emit("ealo-vip-register", value) ;
                   $scope.message = {
                     title :"Merci!",
                     message: " vous serez parmi les tout premiers utilisateurs de easiloc. Nous vous remercions de votre confiance"
                   }
                 }else{
                   $scope.message = {
                     title :"Deja inscrits !",
                     message: " vous serez parmi les tout premiers utilisateurs de easiloc. Nous vous remercions de votre confiance"
                   }
                  }

                 $scope.modalReponse =$uibModal.open({
                   templateUrl: 'app/templates/modals/subscription_info_5.html',
                   scope : $scope ,
                   size : 'sm',
                   windowClass : "partage" ,
                   controller : "InviteCtrl",
                 })
               }

          }] ;
      return {
        templateUrl: '/app/templates/modals/subscription.html',
        bindToController : true,
        controllerAs : 'ctrl',
        controller : controller
      }
    }])
    .directive('ealoRoundProgress', [function() {

      var controller = ['$scope', '$interval', '$timeout', '$window', 'roundProgressService', '$rootScope',function($scope, $interval, $timeout, $window, roundProgressService,$rootScope){
     $scope.restCurrent = 0 ;
    $scope.message = "Attendez un peu ..."
     $scope.current =       10;
     $scope.max =            10;
     $scope.offset =         0;
     $scope.timerCurrent =   0;
     $scope.uploadCurrent =  0;
     $scope.stroke =         5;
     $scope.radius =         30;
     $scope.isSemi =         false;
     $scope.rounded =        false;
     $scope.responsive =     false;
     $scope.clockwise =      true;
     $scope.currentColor =   '#45ccce';
     $scope.bgColor =        '#eaeaea';
     $scope.duration =       10000;
     $scope.currentAnimation = 'easeOutCubic';
     $scope.animationDelay = 0;

     $scope.increment = function(amount){
         $scope.current += (amount || 1);
     };

     $scope.decrement = function(amount){
         $scope.current -= (amount || 1);
     };

     $scope.animations = [];

     angular.forEach(roundProgressService.animations, function(value, key){
         $scope.animations.push(key);
     });

     $scope.getStyle = function(){
         var transform = ($scope.isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';

         return {
             'top': $scope.isSemi ? 'auto' : '45%',
             'bottom': $scope.isSemi ? '5%' : 'auto',
             'left': '50%',
             'transform': transform,
             '-moz-transform': transform,
             '-webkit-transform': transform,
             'font-size': $scope.radius/1.5 + 'px'
         };
     };

     $scope.getColor = function(){
         return $scope.gradient ? 'url(#gradient)' : $scope.currentColor;
     };

     $scope.showPreciseCurrent = function(amount){
         $timeout(function(){
             if(amount <= 0){
                 $scope.preciseCurrent = $scope.current;
             }else{
                 var math = $window.Math;
                 $scope.preciseCurrent = math.min(math.round(amount), $scope.max);
             }
         });
     };
     $scope.showRestCurrent = function(amount){
         $timeout(function(){
             if(amount >= $scope.max){
                 //$scope.restCurrent = $scope.max;
                 $rootScope.$emit("ealo-progress-finish",amount)
             }else{
                 var math = $window.Math;
                 console.log(amount)
                 $scope.restCurrent = math.round($scope.max) - math.round(amount) ;
             }
         });
     };

     var getPadded = function(val){
         return val < 10 ? ('0' + val) : val;
     };

     $interval(function(){
         var date = new Date();
         var hours = date.getHours();
         var minutes = date.getMinutes();
         var seconds = date.getSeconds();

         $scope.hours = hours;
         $scope.minutes = minutes;
         $scope.seconds = seconds;
         $scope.time = getPadded(hours) + ':' + getPadded(minutes) + ':' + getPadded(seconds);
     }, 1000);
 }];

      return {
        templateUrl: '/app/templates/modals/ealo_progressbar.html',
        bindToController : true,
        controllerAs : 'ctrl',
        controller : controller
      }
    }])
;
