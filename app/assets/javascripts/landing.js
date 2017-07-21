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
            "720kb.socialshare"
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

            $scope.fermer = function(){
              $uibModal.$uibModalInstance.close();
            }
            $scope.media_share = function(name){

              return name;
            }
    }])  .controller('vipCtrl',
            ["$scope" ,"$rootScope", function ($scope,$rootScope) {
        $scope.nombre = 0
        $scope.nb_objectif = 500
        $scope.pourcentage = Math.floor(($scope.nombre / $scope.nb_objectif)*100)
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

                 Restangular.all('/locations/landing.json').post({
                 invite:$scope.invite
                 }).then(function(value){
                     $scope.register_response(value)
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

                 $uibModal.open({
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
    }]);
