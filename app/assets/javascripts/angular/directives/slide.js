angular.module('app')
.directive('ealoSlide', [function() {

  var controller = ['$scope','leafletData','$compile','svrOverPass','Restangular','$uibModal', function ($scope,leafletData,$compile,svrOverPass,Restangular,$uibModal) {
           //var self = this ;

              $scope.imsl_actual_images = [
                {
                  name : "image 1",
                  src : "/uploads/attach/filename/2/some_file_name20170530-12000-mffem1"
                },
                {
                  name : "image 2",
                  src : "/uploads/attach/filename/3/some_file_name20170530-12000-1hhsvme"
                }

              ]

             $scope.imsl_init = function(name){
              $scope.imsl_actual_position = 0
             }

             $scope.on_image = function(){
               $scope.on_mouse_over = true
             }
             $scope.off_image = function(){
               $scope.on_mouse_over = false
             }

            //  $scope.imsl_get_images = function(name){
            //    var images = []
            //    _.each(angular.element.find(name + ' img'),function(el){
            //       images.push({src: el.src , title : el.alt })
            //    })
            //    console.log(images)
            //    return images
             //
            //  }
              $scope.imsl_close_modal = function(){
                //if($scope.imsl_modal)
                 //$scope.imsl_modal.close();
              }
             $scope.imsl_open_modal = function(){
              angular.copy($scope.imsl_actual_position ,  $scope.imsl_modal_actual_position )
               $scope.imsl_modal_actual_images = $scope.imsl_actual_images
               $scope.imsl_modal_active_image = $scope.imsl_modal_actual_images[ $scope.imsl_modal_actual_position ]
               $scope.imsl_modal = $uibModal.open({
                    templateUrl: 'app/templates/modals/image_slide.html',
                    size : 'sm',
                    scope: $scope,
                    windowClass:"partage",
                  })
             }


             $scope.imsl_modal_next = function(){
               $scope.imsl_modal_actual_position++
               if($scope.imsl_modal_actual_position == $scope.imsl_modal_actual_images.length ){
                 $scope.imsl_modal_actual_position = 0
               }
               $scope.imsl_set_modal_active_image()
             }
             $scope.imsl_modal_prev = function(){
               $scope.imsl_modal_actual_position--
               if($scope.imsl_modal_actual_position < 0  ){
                 $scope.imsl_modal_actual_position = $scope.imsl_modal_actual_images.length - 1
               }
               $scope.imsl_set_modal_active_image()
             }

             $scope.imsl_next = function(){
               $scope.imsl_actual_position++
               if($scope.imsl_actual_position == $scope.imsl_actual_images.length ){
                 $scope.imsl_actual_position = 0
               }
               $scope.imsl_set_active_image()
             }
             $scope.imsl_prev = function(){
               $scope.imsl_actual_position--
               if($scope.imsl_actual_position < 0  ){
                 $scope.imsl_actual_position = $scope.imsl_actual_images.length - 1
               }
               $scope.imsl_set_active_image()
             }

           $scope.imsl_set_active_image =function(){
             $scope.imsl_active_image = $scope.imsl_actual_images[$scope.imsl_actual_position]
           }
           $scope.imsl_set_modal_active_image =function(){
             $scope.imsl_modal_active_image = $scope.imsl_modal_actual_images[$scope.imsl_modal_actual_position]
           }

            $scope.imsl_init();
            $scope.imsl_set_active_image();
      }] ;
  return {
    templateUrl: '/app/templates/modals/module_slide.html',
    bindToController : true,
    controllerAs : 'ctrl',
    controller : controller
  }
}]) ;
