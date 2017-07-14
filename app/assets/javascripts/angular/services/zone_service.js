
angular.module('app')
        .factory('svrZone' , ['svrOverPass','Restangular', function(svrOverPass,Restangular){
        function pairing(i,j){
            return ((i>=j) ? (i*j + i +j) : (j*j + i));
          }
        function unpairing(n){
          var z = Math.floor(Math.sqrt(n))
          var value = n - z*(z-1)
          if(value < 0){
            return [value + z , z]
          }else{
            return [z,value]
          }
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



      function box_set(x,y){
        var pas = 118
        var precision = 0
        var current_box = box(x,y)
        var boxes = [] ;
        var lat = Math.floor(current_box[0][0]) ;
        var lon = Math.floor(current_box[0][1]) ;
        var lat_fin = lat +1 - precision ;
        var lon_fin = lon + 1 - precision ;
        for(var i = lat ; i < lat_fin ; i += 1/pas){
          for(var j= lon ; j < lon_fin; j += 1/pas){
                    boxes.push({boxe:box(i,j),pairing:pairing(pairing(lat,lon),pairing(Math.round((i-lat)*pas),Math.round((j-lon)*pas)))})
                 }
              }
          return boxes
      }

      function getNearestRoute(maison,routes){
          var proches = [] ;
          var lines = _.map(routes, function(r){
            //r.layer.removeFrom(r.layer._map)
            return r.layer;
          })

        _.each(maison.layer.getLatLngs()[0],function(_latlng){

             var proche = L.LineUtil.proche(lines,_latlng)

              proches.push(proche);

        })
       proches.sort(function(a,b){
         return a.distance - b.distance ;
       })
       //proche = L.LineUtil.proche(lines,latlng) ;
       proches[0].line.setStyle({color:"#0000bb"})
        return proches[0]
      }

      function getPosition(obj){
       var orientation =   L.LineUtil.pointOrientation(obj.line,obj.point)
       var position = orientation[1] == 0 ? 0 : (orientation[1]/Math.abs(orientation[1]))
       return position
      }


       function createAdresse(maison,routes){

               maison.layer.addTo(maison.layer.ealo_active_map)
        var nearest_route = getNearestRoute(maison,routes) ;

        var query ="[out:json];is_in("+maison.points[0][0]+","+maison.points[0][1]+"); area._[admin_level] ; out; "

        svrOverPass.requestOsm(query,function(data){
              var place_point = {} ;

          _.each(data.elements , function(e){
               place_point[e.tags.admin_level] = e.tags.name
               place_point[e.tags.admin_level+"_id"] = e.id
                })
                var location = {
                     quartier:place_point[10]+"_"+place_point["10_id"],
                     arrondissement:place_point[8]+"_"+place_point["8_id"],
                     departement:place_point[6]+"_"+place_point["6_id"],
                     region:place_point[4]+"_"+place_point["4_id"],
                     rue:nearest_route.line.name+"_"+nearest_route.line.id,
                     building:maison.id,
                    //  mairie: $scope.localisation.mairie,
                    //  lng:   $scope.localisation.lng,
                    //  lat:   $scope.localisation.lat,
                     user_id: 0 ,
                    // guest:obj.auth,
                     created_nodes:JSON.stringify(maison.points),
                     position:getPosition(nearest_route)
                   };
                 saveAdresse(location)
               })
              }
            function saveAdresse(location){

              Restangular.all("/locations/save_location.json").post({location: location}).then(function(data){
                console.log("show location on map:" + data)
              })
            }
          function boxAdressesCreated(box){
            var pas = 118 ;
            var lat   =   Math.floor(box[0][0]) ;
            var lon   =   Math.floor(box[0][1]) ;
            var i     =   box[0][0] - Math.floor(box[0][0]) ;
            var j     =   box[0][1] - Math.floor(box[0][1]) ;
            var pair = pairing(pairing(lat,lon),pairing(Math.round((i-lat)*pas),Math.round((j-lon)*pas)))
            Restangular.all("/locations/locations_in_box_created.json").post({pairing : pair }).then(function(data){
              console.log("location in box created:" + data)
            })
          }

        return {
           getBox : function(i,j){
             return box(i,j);
           },
           getBoxSet: function(i,j){
             return box_set(i,j)
           },
           getBuildingInBox: function(box,map){
                var url =  'http://51.255.166.204:9214/api/interpreter'
            // var box = [[3,11],[3.066666667,11.0666666667]]
             var rectangle = L.rectangle(box).addTo(map)
                 map.fitBounds(rectangle.getBounds())
            var box = ""+box[0][0] +","+box[0][1]+ "," + box[1][0] + "," + box[1][1] ;
            console.log(box)
             var query = "[out:json];way("+box+")[~'building' ~ '.'] -> .buildings;way(around.buildings:100)['highway'~'secondary|primary|residential|trunk|tertiary'] -> .streets ;(.buildings ; .streets ; ); (._;>;); out;"

              svrOverPass.requestOsm(query,function(data){
                var _buildings = [] ;
                var _routes = [] ;
                 var ways = svrOverPass.getWays(data.elements);
                   _.each(ways,function(w){
                    if(w.tags){
                      var name =_.map(w.tags,function(v,k){ return k +":" + v }).join("<br/>")
                      if(!w.tags.highway){
                          var points = _.map(w.nodes,function(el,i){
                            return [el.lat , el.lon]
                          })
                          var layer = L.polygon(points,{color:"#bb0000"})
                              layer.addTo(map).bindPopup(name)
                            layer.ealo_active_map = map ;
                           layer.removeFrom(map)
                          w.points = points
                          w.layer = layer
                          _buildings.push(w)
                       }
                       if (w.tags.highway){
                           var points = _.map(w.nodes,function(el,i){
                             return [el.lat , el.lon]
                           })
                            var layer = L.polyline(points,{color:"#00bb00"})
                                layer.addTo(map)
                              //  layer.removeFrom(map)
                                w.points = points

                                layer.name = w.tags.name
                                layer.id = w.id
                                w.layer = layer
                               _routes.push(w)
                        }
                    }

                  });
                // create buildings for all found building in that box
                //console.log(_buildings)
                createAdresse(_buildings[0],_routes)
              // _.each(_bulidings, function(building){
              //     createAdresse(building,_routes)
              // })
              //    boxAdresseCreated(box)

            },url);
               }
          }

    }])
