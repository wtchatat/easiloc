angular.module('app')
 .controller('CitiesController',
 ['$scope' ,  'leafletData','$uibModal','svrOverPass','$templateRequest','svrZone',function($scope , leafletData ,$uibModal,svrOverPass,$templateRequest,svrZone){

function ealoline(_x0,_y0,_x1,_y1,pas=1000){
  var x0 = _x0 , y0 = _y0 , x1 = _x1 , y1 = _y1;
  var bx = Math.floor(x0)+ Math.floor((x0 - Math.floor(x0))*pas)/pas
  var by = Math.floor(y0)+ Math.floor((y0 - Math.floor(y0))*pas)/pas
  L.rectangle([[bx,by],[bx+1/pas,by+1/pas]],{color:"#00bb00"}).addTo($scope.map)
  L.circle([x0,y0],{color:"#00bbff"}).addTo($scope.map)
  var points = [] ;
  if((x0-x1) == 0){
    throw new Error("rayster error, must x0-x1 != 0")
  }
  var t = 1/pas
  , dx = x1 - x0
  , dy = y1 - y0
  , dx = x1 - x0
  , stepX = (dx > 0) ? 1 : -1
  , stepY = (dy > 0) ? 1 : -1
  , deltaX = bx + stepX*t
  , deltaY = by + stepY*t
  , alpha = dy/dx
  , beta = y0 - alpha*x0 ;
  var i = 0;
  console.log(Math.floor(stepX*x0*100000))
  console.log( Math.floor(stepX*x1*100000))
  console.log(Math.floor(stepX*x0*100000) < Math.floor(stepX*x1*100000))
  for(i = 0;i< 4;i++){
    if(deltaY-alpha*deltaX < beta){
      x0 = (deltaY - beta)/alpha
      y0 = deltaY
      deltaX = deltaX + stepX*t
    }else{
      x0 = deltaX
      y0 = alpha*deltaX + beta
        deltaY = deltaY + stepY*t

    }

     if(stepX*x0 < stepX*x1){
       L.marker([x0,y0]).addTo($scope.map)
         points.push([x0,y0])
     }

    
  }

   return points
}


   function box(x,y){
     var pas = 118,
     ent_x  =  Math.floor(x) ,
     ent_y  =  Math.floor(y) ,
     rest_x =  Math.floor((x - ent_x)*pas) ,
     rest_y =  Math.floor((y - ent_y)*pas);
     return [
             [ent_x + (rest_x/pas) , ent_y + (rest_y/pas)],
             [ent_x + (rest_x + 1)/pas , ent_y + (rest_y + 1)/pas],
           ];
   }

      function box_set(b,pas=32){

        var precision = 0
        var sw = b._southWest
        var ne = b._northEast
        var boxes = [] ;
        var lat = Math.floor(sw.lat)+ Math.floor((sw.lat - Math.floor(sw.lat))*pas)/pas ;
        var lon = Math.floor(sw.lng)+ Math.floor((sw.lng - Math.floor(sw.lng))*pas)/pas ;
        var lat_fin = ne.lat ;
        var lon_fin = ne.lng ;


        for(var i = lat ; i < lat_fin ; i += 1/pas){
          for(var j= lon ; j < lon_fin; j += 1/pas){
                    boxes.push([[i,j],[i+1/pas,j+1/pas]])
                 }
              }
          return boxes
      }


      $scope.$on("ealo-subdvision-selected", function(e,v){
        if($scope.line){
          $scope.line.removeFrom($scope.map)
        }

          $scope.line = L.polyline(v.points,{color:"#993300" , smoothFactor : 1}).addTo($scope.map) ;
          ///  var pol = new L.Polygon(line.getLatLngs()).addTo($scope.map);
             var box = $scope.line.getBounds() ;
             var lines = $scope.line.getLatLngs()
             var boxes = box_set(box,1000)
             var main_boxes = []
             var distance_max = 0 ;
                   for(var i = 0 , ilen = lines.length ; i < ilen ; i ++){
                   for(var j = 0 , jlen = lines[i].length  ; j < (jlen - 1) ; j++){
                  distance_max += 1 ;
                   main_boxes.push(ealoline(
                     lines[i][j].lat,
                     lines[i][j].lng,
                     lines[i][j+1].lat,
                     lines[i][j+1].lng,
                     ))
                    }
                  }
        _.each(boxes,function(box){
          L.rectangle(box,{color:"#bb00bb"}).addTo($scope.map)
        })
             L.marker(box._southWest).addTo($scope.map)
             $scope.map.fitBounds($scope.line.getBounds());
             L.rectangle($scope.line.getBounds(),{color:"#0000bb"}).addTo($scope.map)
          //  $scope.map.setView(position["center"], 14);


    })
    leafletData.getMap().then(function(map){
      $scope.map = map
    })

 }])
