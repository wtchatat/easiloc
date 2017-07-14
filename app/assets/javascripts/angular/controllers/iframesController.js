angular.module('app-contact')
 .controller('IframesController',[ '$scope' , '$state','$stateParams','$location', 'leafletData','$uibModal', 'Restangular','$filter' , 'osmOverpassAPI','$rootScope','$http','svrUser','svrLocation','svrOverPass','$compile', 'notify',function($scope , $state , $stateParams,$location, leafletData ,$uibModal,Restangular,$filter,osmOverpassAPI,$rootScope,$http,svrUser,svrLocation,svrOverPass,$compile,notify){


   // CONFIG CONTROLLER PARAMETER

           var state_name = $state.current.name ;
           var action = $stateParams.action ;
           $scope.routing_formatter = new L.Routing.Formatter({language:'fr'})
           $scope.guest_route = [] ;
           $scope.guest_location = [] ;
           $scope.guest_location_address = [] ;
           $scope.guest_address = [] ;
           $scope.route_user = null ;
           $scope.location_user = null ;
           $scope.saving_guest_route =false;
           $scope.filter_location = [
             {type:"créées" , name: "Mes addresses créées"},
             {type:"suivies" , name: "Mes adresses suivies"},
             {type:"favorites" , name: "Mes adresses favorites"},
             {type:"partagées" , name: "Mes adresses partagées"},
             {type:"domiciles" , name: "Mes adresses domiciles"},
             {type:"bureaux" , name: "Mes adresses bureaux"},
           ];
           $scope.filter_route = [
             {type:"favoris" , name: "Mes Itineraires favoris"},
             {type:"partagés" , name: "Mes Itineraires partagés"},
           ];
           $rootScope.current_scope = $scope ;
        $scope.defaults = {
          closePopupOnClick:false

        }


   // UTIL METHODS FOR CONTROLLER

           $scope.loadMap = function(obj){

             leafletData.getMap(obj.scope).then(function(map){
                $scope.map = map
               //  if(obj.scope){
               //    obj.scope.map = map
               //  }
                $scope.map.zoomControl.remove()
               // ajoute le menu contextual
                   var mapMenu = new L.Map.ContextMenu(map)

               mapMenu.addItem({ text: 'Creer une addresse', callback: function(e){$scope.create_addresse(e,obj) } })
               mapMenu.addHooks()




               map.setView([3.86785, 11.52088], 16);
                 if ($stateParams.action == "partage"){
                   $scope.partage_show(location.href.split("?")[1].split("=")[1])
                 }
                 if ($stateParams.action == "shareit"){
                   $scope.partage_show_route(location.href.split("?")[1].split("=")[1])
                 }
                 if ($stateParams.action == "residence"){
                   //$scope.currentUserLocations = []
                     $scope.init_residence()
                 }

                  $scope.admin();
                  //console.log($scope)
             })

                    }

     $scope.set_filter_to_user_locations = function(index){
       $scope.active_filter_location  = $scope.filter_location[index]
       if(index == 0){
         $scope.user_locations = $scope.permanent_user_locations
       }
       if(index == 1){
         //
         $scope.user_locations = undefined ;
         if($scope.user_suivi_locations == undefined){

           Restangular.one("locations/get_user_suivi_locations.json?user_id="+$scope.currentUser.id).get().then(function(data){
             $scope.user_locations = data ;
             $scope.user_suivi_locations = data
           },function(error){

           })
         }else{
           $scope.user_locations = $scope.user_suivi_locations
         }



       }
       if(index == 2){
         $scope.user_locations = undefined ;
         if($scope.user_favorite_locations == undefined){
           Restangular.one("locations/get_user_favorite_locations.json?user_id="+$scope.currentUser.id).get().then(function(data){

             $scope.user_locations = data ;
             $scope.user_favorite_locations = data
           },function(error){

           })
         }else{
           $scope.user_locations = $scope.user_favorite_locations
         }





       }
       if(index == 3){
         $scope.user_locations  = _.select($scope.permanent_user_locations,function(u){
           return (u.type_id % 10  != 0);
         })

       }
       if(index == 4){
         $scope.user_locations  = _.select($scope.permanent_user_locations,function(u){
           return (u.nature == "D");
         })

       }
       if(index == 5){
         $scope.user_locations  = _.select($scope.permanent_user_locations,function(u){
           return (u.nature == "B");
         })

       }

     }

     $scope.set_filter_to_user_routes = function(index){
       $scope.active_filter_route  = $scope.filter_route[index]
       if(index == 0){

         $scope.user_routes = $scope.permanent_user_routes

       }
       if(index == 1){
         //

         $scope.user_routes= undefined ;
         if($scope.user_partage_routes == undefined){
           Restangular.one("locations/get_user_partage_routes.json?user_id="+$scope.currentUser.id).get().then(function(data){
             //var _data = $scope.set_partage_guest(data );

             $scope.user_partage_routes = $scope.user_routes_jsonify(data) ;
             $scope.user_routes = $scope.user_routes_jsonify(data);
             //console.log(  $scope.user_partage_routes)
           },function(error){

           })
         }else{
           $scope.user_routes = $scope.user_partage_routes
         }
       }
     }
     $scope.remove_route_item_on_map = function(){
       if( $scope.active_current_control != undefined){
         $(document.getElementsByClassName("results")).remove()
         $scope.active_current_control._clearLines();
         _.each($scope.active_current_control.options.circles , function(c){
           c.removeFrom($scope.map)
         })
       }

     }

     $scope.route_item_show = function(index){

            $scope.remove_route_item_on_map()

          $scope.active_route = $scope.user_routes[index]

       var control = L.Routing.control({
            addWaypoints:false,
            createMarker:function(i,wp,nwp){
                            return L.circle(wp.latLng,{radius:5,color:"#000000",fillColor:"#ffffff",fillOpacity:0.9}).bindPopup(wp.name).openPopup()
                          },
            addWaypoints:false,
            routeLine : function(route,options){
            //console.log( route)
           //   console.log( options)
                         var chemin_spec = "<div class='chemin_court'>Chemin le plus court</div>"
                         var currentLine = new L.Routing.Line(route,options)
                           var circles = [] ;
                                currentLine.eachLayer(function (layer) {
                                    if ( route.routesIndex > 0){
                                       chemin_spec = "<div class='chemin_long'>Chemin le moins court</div>"
                                      }
                         var popup = layer.bindPopup("<div class='routeInfo fa_color_routeInfo'><span><i class='fa fa-car'></i></span> " + $scope.convert_distance(route.summary.totalDistance) + " - " + $scope.convert_time(route.summary.totalTime) + "</div>"+ chemin_spec )
                         layer.on("add",function(){
                              _.each(route.instructions,function(el){
                             circle = L.circleMarker(route.coordinates[el.index],{
                                                color  : "#86c9e9",
                                                radius : 3,
                                                fill   : true,
                                                weight :  1,
                                                fillColor: "#ffffff",
                                               fillOpacity  :0.8
                                      })
                                var circlePopup = circle.bindPopup("<div class=''>"+ el.text +"</div>")
                                circle.on("mouseover",function(){
                                   circlePopup.openPopup()
                                   })
                                circle.on("mouseout",function(){
                              //circlePopup.closePopup()
                                   })
                                circle.addTo($scope.map)
                                circles.push(circle)
                              })
                    popup.openPopup();

   })

   });

   //currentLine.bindPopup(route.summary.totalDistance + "<br/>" + route.summary.totalTime).openPopup();
    this.circles = circles
   return currentLine;
   },
   showAlternatives:true,
   lineOptions :
   {
   styles: [{color: 'black', opacity: 0.15, weight: 9}, {color: 'white', opacity: 0.8, weight: 6}, {color: "#4686B1", opacity: 1, weight: 5}]
   } ,
   altLineOptions :
   {
   styles: [{color: 'black', opacity: 0.15, weight: 9}, {color: 'white', opacity: 0.8, weight: 6}, {color: '#999999', opacity: 1, weight: 3}]
   } ,
   language: 'fr',
   autoRoute : false,
   routeWhileDragging: true,
   reverseWaypoints: true,
   fitSelectedRoutes: true
   });
         $scope.active_route = _.map($scope.active_route.routes , function(r){

             r.waypoints =  _.map(r.waypoints , function(wp){
               wp = new L.Routing.waypoint(new L.LatLng(wp.latLng.lat,wp.latLng.lng), wp.name)
               return wp ;
             })

             r.coordinates = _.map(r.coordinates,function(cd){
               cd = new L.LatLng(cd.lat , cd.lng)
               return cd ;
             })
             r.inputWaypoints = _.map(r.inputWaypoints,function(iwp){
               iwp.latLng = new L.LatLng(iwp.latLng.lat , iwp.latLng.lng)
               return iwp;
             })

                       return r;
           })

          control.onAdd($scope.map)
          var selectedRoute = $scope.active_route[0];
           control._routeSelected({route: selectedRoute, alternatives: null});
           var results =  L.DomUtil.create('div', 'results');
           var results_title = L.DomUtil.create('div', 'title_result')
                results_title.innerHTML = "Itineraire detaillé "
               results.appendChild(results_title)
           var container = control._createAlternative(selectedRoute,0)
           console.log(container)
            results.appendChild(container);

           // control.fire('routeselected', {route: selectedRoute,	alternatives: null
           //   })
           // //control.fire('routeselected', $scope.active_route);

          document.body.appendChild(results)
         console.log(results)
         //  plan = new L.Routing.Plan($scope.active_route.routes[0].waypoints)
         //  $scope.map.addLayer(plan) ;
         $scope.active_current_control = control
     }

    $scope.user_routes_jsonify = function(s){
      _.each(s, function(e){

         if(e["routes"] != undefined && _.isString(e["routes"])){
           e["routes"] = JSON.parse(e["routes"])

         }
      })
     return s;
    }
    $scope.set_partage_guest = function(data){
      //var hash_data = _.groupBy(data,function(ele){ return ele.url})

     // var filter_data = data
     // // console.log(hash_data)
     //   _.each(hash_data,function(k,v){
     //        var d = {}
     // //       console.log(k)
     // //       console.log('-----' )
     //        d["url"] = v
     //
     //        d["guests"] =[]
     //       d["user_id"] = k[0]["user_id"]
     //       _.each(k,function(val){
     //          d["guests"].push(_.pick(val,"email","name"))
     //        })
     //        var hash_guests = _.groupBy(d["guests"],function(g){return g.email})
     //           d["guests"] = []
     //           _.each(hash_guests,function(k,v){
     //             var ele ={}
     //                 ele["email"] = v
     //                 // ele["name"] =_.compact(_.map(k,function(e){return e.name}))[0]
     //                 ele ["name"] = k[0]["name"]
     //                 ele["relance"] = k.length
     //                 d["guests"].push(ele)
     //           })
     //    console.log(d)
     // //     filter_data.push(d)
     //  })
     //  console.log(hash_data)
     //  return filter_data;
    }
    $scope.what_filter_route = function(index){
      if($scope.active_filter_route.type  == $scope.filter_route[index].type){
        return "active_filter_location";
      }
    }
     $scope.what_filter_location = function(index){
       if($scope.active_filter_location.type  == $scope.filter_location[index].type){
         return "active_filter_location";
       }
     }

     $scope.set_map_on_right=function(){
       angular.element(".map_container").addClass("map_on_right")
       $scope.map.invalidateSize();
     }
     $scope.remove_map_on_right=function(){
       angular.element(".map_container").removeClass("map_on_right")
       $scope.map.invalidateSize();
     }

       $scope.onSelect = function(c,v,b){
          var element = c.split("#")
          var level = 2
           if((element[1].trim()) == "Region"){
             level = 4
           }
           if((element[1].trim()) == "Departement"){
             level = 6
           }
           if((element[1].trim()) == "Arrondissement"){
             level = 8
           }
           if((element[1].trim()) == "Quartier"){
             level = 10
           }
           element[0] = element[0].trim() ;
           var  position = $scope.subdivision[level][element[0]]


           // positionnner la carte selon l'endroit
           var points = $scope.parse_polygon_points(position["points"])

             var line = L.polyline(points,{color:"#993300" , smoothFactor : 1}).addTo($scope.map) ;
           ///  var pol = new L.Polygon(line.getLatLngs()).addTo($scope.map);
              $scope.map.fitBounds(line.getBounds());
           //  $scope.map.setView(position["center"], 14);

       }
     $scope.parse_polygon_points = function(points){
       var _points = _.map(JSON.parse(points) ,
                function(e){
                  return _.map(e,
                    function(t){
                      return JSON.parse(t)
                    })
                  })
       return _points;
     }



       $scope.partage_show_route = function(s){
         var link =s
         var places = link.split(";")
         var wp = places[0].split("#")
          var depart = wp[0].split("@")

         var arrive = wp[1].split("@")
        var  location = places[1].split("!")
         $http({
       method: 'GET',
       url: "locations/"+location[0]+".json"
       }).then(function(c){

             var c = c.data
             var line =   L.polygon(JSON.parse(c.points),{color:"#003366"}).addTo($scope.map)
           .bindPopup("<strong>" + c.name +"</strong>" + "<br/>" +c.address)
           .openPopup();
         })
         $http({
       method: 'GET',
       url: "locations/"+location[1]+".json"
       }).then(function(c){
             var c = c.data
             var line =   L.polygon(JSON.parse(c.points),{color:"#003366"}).addTo($scope.map)
           .bindPopup("<strong>" + c.name +"</strong>" + "<br/>" +c.address)
           .openPopup();
         })
         var control =  L.Routing.control({
              containerClassName:"results",
               language: 'fr',
       waypoints: [
       L.latLng(depart[0], depart[1]),
       L.latLng(arrive[0], arrive[1])
       ],
       routeWhileDragging: true,
       reverseWaypoints: true,
       fitSelectedRoutes: true
       })
        };


       $scope.partage_show = function(id){
         //Restangular.one("locations/partage/"+id+".json").get()
         $http({
     method: 'GET',
     url: "locations/partage/"+id+".json"
   }).then(function(c){
             var c = c.data
             var line =   L.polygon(JSON.parse(c.points),{color:"#003366"}).addTo($scope.map)
           .bindPopup("<strong>" + c.name +"</strong>" + "<br/>" +c.address)
           .openPopup();
           $scope.map.fitBounds(line.getBounds())

         })

       }


      $scope.admin = function(){
        parent_cog = function(filter, cog, level){
          var cog = cog , level = level ;
          if(!!level || level < 5 || cog){
           return;
          }

          return filter[cog.to_s.slice(0,cog.to_s.length - 2)];
        }
        filter_cog={}
        filter_admin={}
        filter_admin[10] = {}
        filter_admin[8] = {}
        filter_admin[6] = {}
        filter_admin[4] = {}
        filter_admin[7] = {}
        filter_admin[3] = {}
        filter_admin[9] = {}
        filter_admin[5] = {}
        filter_admin[2] = {}
       Restangular.one("cities.json").get().then(function(c){
              _.each(c,function(e){
              filter_admin[e["level"]][e["nom"].trim()] = {"center" : e["center"]  , "cog" : e["cog"] , "points" :e["points"]  }
          })
           $scope.subdivision = filter_admin
           $scope.sub_regions = _.flatten([_.map(filter_admin[4] , function(k,v){ return v + " # Region" ;}) ,
                               _.map(filter_admin[6] , function(k,v){ return v + " # Departement" ;}) ,
                               _.map(filter_admin[8] , function(k,v){ return v + " # Arrondissement" ;}) ,
                                 _.map(filter_admin[10] , function(k,v){ return v + " # Quartier" ;})
                               ])
                 })
      }


      //http://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL#By_area_.28area.29
     //By convention the area id can be calculated from an existing OSM way by adding 2400000000 to its OSM id, or in case of a relation by adding 3600000000 respectively.
         $scope.regions = function(latlng){
           var query ="[out:json];is_in("+latlng.lat+","+latlng.lng+"); area._[admin_level] ; out; "
           var query2 = "[out:json];way(around:100,"+latlng.lat+","+latlng.lng+")['highway'~'secondary|primary|residential|trunk|tertiary'];(._; >;); out;"
           var query3 =  "[out:json];way(around:10,"+latlng.lat+","+latlng.lng+")['building'];(._; >;); out;"

           var place_point = {} ;
           var route = []
           svrOverPass.requestOsm(query,function(data){
             // recupere les unites admiistratives du point
             _.each(data.elements , function(e){
                  place_point[e.tags.admin_level] = e.tags.name
                  place_point[e.tags.admin_level+"_id"] = e.id
               })
             // recherche  les routes dans un  rayon de 100 m
               svrOverPass.requestOsm(query2,function(data){
                 var element = svrOverPass.getWays(data.elements) ;
                 svrOverPass.setPath(element, $scope.map)
             // recherche les maisons dans un rayon de 10m
                 svrOverPass.requestOsm(query3, function(data){
                      var element = svrOverPass.getWays(data.elements) ;
                      svrOverPass.setBuilding(element,$scope.map)
                  })
                })
           })
         }




               $scope.partager_location = function(s){
                      $scope.share_link = s
                     // create localisation
                     // Link for sharing this view
                     $uibModal.open({
                       templateUrl: 'app/templates/modals/partage_location.html',
                       scope : $scope ,
                       size : 'sm',
                       backdropClass : "partage" ,
                       controller : "LocalisationsController",
                     })
               }




      $scope.create_addresse = function(e,obj) {
        $scope.map.setView([e.latlng.lat, e.latlng.lng], 18);
        $scope.cp = e.latlng;
        $scope.obj = obj;
        $scope.marker = L.marker([e.latlng.lat, e.latlng.lng],{draggable:true})
        $scope.marker.addTo($scope.map)
       .bindPopup($compile('<div>Ajuster votre localisation<br/><a style="color:#fff" ng-click="create_addresse_modal(cp,marker,obj)" class="btn btn-primary btn-xs"><i class="fa fa-close"></i> valider </a></div>')($scope)[0])
       .openPopup();
        $scope.marker.on("moveend",function(e){
         $scope.cp = e.target._latlng
       })
      }


           /*  EVENTS ON THIS CONTROLLER */
             $scope.close_addresse_modal = function(){
               $scope.instance_addresse_modal.close()

             }


              $scope.create_addresse_modal = function(e,m,obj){

                  m.removeFrom($scope.map)
                   $scope.current_place={} ;
                   $scope.current_place.lat = e.lat;
                   $scope.current_place.lng = e.lng;
                   if(obj.third){
                   $scope.location_init()
                   }else{
                     $scope.instance_location_modal = $uibModal.open({
                         templateUrl: 'app/templates/modals/create_addresse_2.html',
                         size : 'sm',
                         scope: $scope,
                         controller : "LocalisationsController",

                       });

                   }


              }

              $scope.save_guest_location = function(){

                Restangular.all("locations/location_partage.json").post(
                  {
                    users: $scope.guest_location,
                    // à modifier
                    user_id: 1,
                    url: "http://localhost:3000/#/localisations/location?id:" + $scope.location_id,
                  }).then(function(data){
                   notify({ message:"Vous avez avez partager cette adresse avec:" + data.length })
                },function(error){console.log(error)})
              }

              $scope.add_guest_location = function(){

                if($scope.location_user != null && $scope.location_user ){

                  $scope.guest_location.push($scope.location_user)
                }
                  $scope.location_user = null

                }
              $scope.remove_guest_location = function(index){
                    $scope.guest_location.splice(index,1)
                }

                $scope.add_location_favourite = function(build_id,loc_id){
                  svrUser.requestCurrentUser(function(data){
                    Restangular.all("locations/set_user_favorite_location.json").post({
                      bulding_id : build_id ,
                      location_id: loc_id,
                      user_id : data.id
                    }).then(function(e){
                       var lien = "http://localhost:3000/#/localisations/location?s="+build_id
                       notify({ message:"Vous avez mis en favoris<a href='"+lien +"'><b> Cette addresse </b></a>" } );

                    },function(error){
                    console.log(error)
                  })
                  })
          }

           $scope.associer_addresse = function(e){


              }

           /* MENU METHODS*/
           $scope.route_cree = function(index){

             svrUser.requestCurrentUser(function(data){
               $scope.currentUser = data ;
               $scope.set_filter_to_user_routes(index)

               Restangular.one("locations/get_user_favorite_routes.json?user_id="+data.id).get().then(function(routes){
                    $scope.user_routes = $scope.user_routes_jsonify(routes)
                 $scope.permanent_user_routes = $scope.user_routes_jsonify(routes)

                 $scope.instance_route_cree = $uibModal.open({
                      templateUrl: 'app/templates/modals/route_cree_4.html',
                      size : 'sm',
                      scope: $scope,
                      controller : "LocalisationsController",
                    });
                    $scope.set_map_on_right();
               },function(error){


               })
               })

               }
     $scope.close_route_cree = function(){
           $scope.remove_route_item_on_map();
         $scope.instance_route_cree.close() ;


     }

           $scope.addresse_cree = function(index){

             svrUser.requestCurrentUser(function(data){
               $scope.currentUser = data ;
               $scope.set_filter_to_user_locations(index)
               Restangular.one("locations/user_locations.json?user_id="+data.id).get().then(function(locs){
                 $scope.user_locations = locs
                 $scope.permanent_user_locations = locs
                 $scope.instance_addresse_cree = $uibModal.open({
                      templateUrl: 'app/templates/modals/addresse_cree_2.html',
                      size : 'sm',
                      scope: $scope,
                      controller : "LocalisationsController",
                    });
                    $scope.set_map_on_right();
               },function(error){


               })
               })

               }

           $scope.close_addresse_cree = function(){
             $scope.instance_addresse_cree.close() ;
             if(  $scope.active_location != undefined){
                 $scope.active_location.removeFrom($scope.map)
             }
             $scope.remove_map_on_right();
           }

           $scope.location_position = function(index){
             if($scope.active_location != undefined){
               $scope.active_location.removeFrom($scope.map)
             }
             var active_location = $scope.user_locations[index]
             var addr ="<div>"+ active_location.address
                  addr += "<hr/><div class='routing_tools'><a  href='#' uib-popover='favoris' popover-trigger='mouseenter' popover-placement='bottom' ng-click='add_location_favourite("+active_location.building+","+active_location.id+")'><i class='fa fa-map-pin'></i></a><a href='#' uib-popover='partager' popover-trigger='mouseenter' popover-placement='bottom' ng-click=partage_location("+active_location.building+")><i class='fa fa-share-alt'></i></a></div></div>"
                  addr = $compile(addr);

            $scope.active_location = L.polygon(JSON.parse(active_location.points)).addTo($scope.map)
          $scope.active_location.bindPopup(addr($scope)[0]).openPopup();
              var position = $scope.active_location.getLatLngs() ;

              $scope.map.setView( [position[0][0].lat ,position[0][0].lng],16);
           }


           $scope.definir_domicile = function(e){
             alert("domicile")
           }
           $scope.definir_travail = function(e){
             alert("travail")
           }

         /* residence */
           $scope.residence = function(){
             $scope.init_residence()
           }
           $scope.init_residence = function(){
              svrUser.requestCurrentUser(function(data){
                $scope.currentUser = data ;

                 svrLocation.getLocations(data.id,function(element){
                  $scope.currentUserLocations = element
                   $scope.locPosition(element[0].id)
                 })
              })
           }
           $scope.locPosition = function(id){
             var selectedLocation = _.select($scope.currentUserLocations, function(e){return e.id == id })
             $scope.map.setView([selectedLocation[0].lat,selectedLocation[0].lng],18)
            var addr ="<div>" + selectedLocation[0].address +"<hr/>+<a ng-click='partager_location("+selectedLocation[0].building_id+")'> partager </a></div>"
                addr = $compile(addr);
                L.marker([selectedLocation[0].lat,selectedLocation[0].lng]).bindPopup(addr($scope)[0]).addTo($scope.map)
                 $scope.locationCenter = {
                   lat: selectedLocation[0].lat ,
                   lng: selectedLocation[0].lng
                 }
           }
           $scope.init_share = function(){
             // widget sharing

           }
           $scope.open_menu = function(){
             // donne une valeur -1 pour tester si la recherche est finie ou pas modifiable
             $scope.favorite_routes = - 1
       svrUser.requestCurrentUser(function(user){
           Restangular.one('/locations/favorite_route.json').get({user_id : user.id}).then(function(data){
             $scope.favorite_routes = data
             })
           })
             $scope.InstanceModal_menu = $uibModal.open({
                templateUrl: 'app/templates/modals/menu_5.html',
                size : 'sm',
                scope: $scope,
                controller : "LocalisationsController"
              });

           }
           $scope.close_menu = function(){
                 $scope.InstanceModal_menu.close()
           }

   $scope.onSelectDepart = function(e,i,v){
      $scope.depart = i

   }
   $scope.onSelectArrive = function(e,i,v){
     $scope.arrive = i
   }

   $scope.convert_distance = function(d){
    return $scope.routing_formatter.formatDistance(d)
   }
   $scope.convert_time = function(t){
      return $scope.routing_formatter.formatTime(t)
   }

         $scope.onChange = function(){
           //console.log($scope.depart)
         }


         $scope.open_plan_localisation = function(latlng){
           $scope.plan_position = latlng
           $scope.InstanceModal_menu = $uibModal.open({
              templateUrl: 'app/templates/modals/plan.html',
              size : 'sm',
              scope: $scope,
              backdrop:'static',
              controller : "LocalisationsController",
            });

         }

         $scope.partage_location = function(s){
                $scope.location_id = s
               // create localisation
               // Link for sharing this view
               $uibModal.open({
                 templateUrl: 'app/templates/modals/partage_location2.html',
                 scope : $scope ,
                 size : 'sm',
                 controller : "LocalisationsController",
               })
         }

         $scope.share_location = function(){

            var location_id = $location.url().split("=")[1]
               leafletData.getMap().then(function(map){
               $scope.map = map

           $scope.partage_show(location_id)
         })

         }

       $scope.initialize_route_data = function(fn){

          if($scope.locations === undefined || $scope.locations.length == 0){

            Restangular.all("locations/search.json").post().then(function(c){

               fn(c)
            },

            function(error){
              console.log(error)
            }
          )

        }else{
          fn($scope.locations)
        }
       }



       $scope.open_route =function(){
         $scope.map.on('click',function(e){

         if($scope.depart != undefined && $scope.depart.texte == ""){
           $scope.depart = undefined
         }
         if($scope.arrive != undefined && $scope.arrive.texte == ""){
           $scope.arrive = undefined
         }

           if($scope.depart === undefined){
               $scope.depart = {}
               $scope.depart.texte =(""+ e.latlng.lat).slice(0,7) + "," + (""+ e.latlng.lng).slice(0,7);
               $scope.depart.lat = e.latlng.lat
               $scope.depart.lng = e.latlng.lng

           }else{
               if($scope.arrive === undefined){
                   $scope.arrive = {}
                   $scope.arrive.lat = e.latlng.lat
                   $scope.arrive.lng = e.latlng.lng
               $scope.arrive.texte = (""+ e.latlng.lat).slice(0,7) + "," + (""+ e.latlng.lng).slice(0,7);

               }
           }


         })
         $scope.initialize_route_data(function(c){
           $scope.locations = c;
           $scope.routing_active = true ;
           $scope.instance_open_route_modal = $uibModal.open({
              templateUrl: 'app/templates/modals/route.html',
              size : 'sm',
              scope: $scope,
              backdrop:'static',
              controller : "LocalisationsController",
            });

         });

       }

       $scope.close_route =function(){

           $scope.routing_active = false ;
           $scope.instance_open_route_modal.close() ;
           remove_itineraire_onmap();
       }

     $scope.save_route = function(r){

       Restangular.all("locations/save_user_route.json").post({
         url: $scope.link_part,
         routes: JSON.stringify(r),
         user_id: ($scope.currentUser == undefined) ? 1 : $scope.currentUser.id
       }).then(function(data){
         notify({ message:" L itineraire a ete sauvegarde"})
       },function(){

       })


     }


       $scope.search_route=function(){

          var control =  L.Routing.control({
                                 createMarker:function(i,wp,nwp){
                                                 return L.circle(wp.latLng,{radius:5,color:"#000000",fillColor:"#ffffff",fillOpacity:0.9}).bindPopup(wp.name).openPopup()
                                               },
                                 addWaypoints:false,
                                  router: L.Routing.mapbox('pk.eyJ1Ijoid3RjaGF0YXQiLCJhIjoiY2oydDc5eGxpMDBheDJwcWNlaG9qa2RqbCJ9.RiGbV3DiFXzXBnTZSMebSA'),
                                 routeLine : function(route,options){
                                 //console.log( route)
                                //   console.log( options)
                                              var chemin_spec = "<div class='chemin_court'>Chemin le plus court <i class='fa fa-check-circle pull-right'></i></div>"
                                              var currentLine = new L.Routing.Line(route,options)
                                                     currentLine.eachLayer(function (layer) {
                                                         if ( route.routesIndex > 0){
                                                            chemin_spec = "<div class='chemin_long'>Chemin le moins court</div>"
                                                           }
                                              var popup = layer.bindPopup("<div class='routeInfo'><span><i class='fa fa-car'></i></span>  Distance" + $scope.convert_distance(route.summary.totalDistance) + "<br/> Durée" + $scope.convert_time(route.summary.totalTime) + "</div>"+ chemin_spec )
                                              layer.on("add",function(){
                                                   _.each(route.instructions,function(el){
                                                   var circle = L.circleMarker(route.coordinates[el.index],{
                                                                     color  : "#86c9e9",
                                                                     radius : 3,
                                                                     fill   : true,
                                                                     weight :  1,
                                                                     fillColor: "#ffffff",
                                                                    fillOpacity  :0.8
                                                           })
                                                     var circlePopup = circle.bindPopup("<div class=''>"+ el.text +"</div>")
                                                     circle.on("mouseover",function(){
                                                        circlePopup.openPopup()
                                                        })
                                                     circle.on("mouseout",function(){
                                                   //circlePopup.closePopup()
                                                        })
                                                     circle.addTo($scope.map)
                                                   })
                                         popup.openPopup();
                        })

                  });

             //currentLine.bindPopup(route.summary.totalDistance + "<br/>" + route.summary.totalTime).openPopup();

             return currentLine;
           },
           showAlternatives:true,
           lineOptions :
           {
             styles: [{color: 'black', opacity: 0.15, weight: 9}, {color: 'white', opacity: 0.8, weight: 6}, {color: "#4686B1", opacity: 1, weight: 5}]
           } ,
           altLineOptions :
           {
             styles: [{color: 'black', opacity: 0.15, weight: 9}, {color: 'white', opacity: 0.8, weight: 6}, {color: '#999999', opacity: 1, weight: 3}]
           } ,
             containerClassName:"results",
            language: 'fr',
   waypoints: [
   {latLng:L.latLng($scope.depart.lat, $scope.depart.lng), name: $scope.depart.texte , id :$scope.depart.id },
   {latLng:L.latLng($scope.arrive.lat, $scope.arrive.lng), name: $scope.arrive.texte , id :$scope.arrive.id }
   ],
   routeWhileDragging: true,
   reverseWaypoints: true,
   fitSelectedRoutes: true
   });

   var routeBlock = control.onAdd($scope.map);
     $scope.routing_control = control ;

   document.getElementById('routing_results').appendChild(routeBlock);
   $scope.link_part = $scope.depart.lat+"@"+ $scope.depart.lng+"#"+ $scope.arrive.lat +"@"+ $scope.arrive.lng +";" + $scope.depart.id +"!" + $scope.arrive.id
   $scope.link ="http://localhost:3000/#/localisations/share?wp="+ $scope.link_part

    control.on("routesfound",function(e){

      $scope.$place = e
      var partageBlock = "<div class='share_container'><div class='routing_tools'><a href='#' uib-popover='favoris' popover-trigger='mouseenter' popover-placement='bottom' ng-click='add_route_favourite($place.waypoints,routing_control._routes)'><i class='fa fa-map-pin'></i></a><a href='#' uib-popover='partager' popover-trigger='mouseenter' popover-placement='bottom' ng-click='partager_route(link,routing_control._routes)'><i class='fa fa-share-alt'></i></a></div>"
       partageBlock = $compile(partageBlock)($scope)[0]
     document.getElementById('routing_results').prepend(partageBlock);
    })
       }

       $scope.direction_change = function(){
         //$scope.partager_route();
       }
             $scope.partager_route = function(s,r){
                   $scope.save_routes(r)
                   $scope.share_link= $scope.link
                   $uibModal.open({
                     templateUrl: 'app/templates/modals/partage3.html',
                     scope : $scope ,
                     backdropClass : "partage" ,
                     size : 'sm',
                     windowTopClass:"partage",
                     controller : "LocalisationsController",
                   })
             }

      $scope.close_favourite_route_info = function(){
        $scope.instance_favourite_route_info_modal.close()

      }
       $scope.add_route_favourite = function(e,r){
         svrUser.requestCurrentUser(function(data){

           $scope.save_route(r)
           Restangular.all("locations/set_user_favorite_route.json").post({
             text : $scope.link_part ,
             user_id : data.id
           }).then(function(e){
             $scope.actuel_favourite_route = e

              notify({ message:"Vous avez mis en favoris<a href='"+$scope.link +"'><b> Cet itineraire </b></a>" } );

           },function(error){
           console.log(error)
         })
         })
           _.each(e,function(i){
             console.log(i)
           })

       }
       $scope.save_guest_route = function(){

         Restangular.all("locations/route_partage.json").post(
           {
             users: $scope.guest_route,
             // à modifier
             user_id: 1,
             url: $scope.link
           }).then(function(data){
            notify({ message:"Vous avez avez partager cet itineraire avec:" + data.length })
         },function(error){console.log(error)})
       }
       $scope.share_route = function(){

          var link = $location.url().split("=")[1]
          var links = link.split(";")
          var routes = links[0].split("#")
          var depart = routes[0].split("@")
          var arrive = routes[routes.length-1].split("@")
          $scope.depart = {lat:depart[0] , lng:depart[depart.length-1] , texte:"depart" , id : 1 }
          $scope.arrive = {lat:arrive[0] , lng:arrive[arrive.length-1] , texte:"arrive" , id : 1 }
          leafletData.getMap().then(function(map){
             $scope.map = map
         // $scope.arrive =
         $scope.search_route();
       })
       //partage_show_route(s)
       }
       $scope.open_favorite_route = function(){

           $scope.InstanceModal_menu = $uibModal.open({
              templateUrl: 'app/templates/modals/show_favorite_route.html',
              size : 'sm',
              scope: $scope,
              backdrop:'static',
              controller : 'LocalisationsController',
            });

       }
     $scope.add_guest_route = function(){
       if($scope.route_user != null && $scope.route_user ){
         $scope.guest_route.push($scope.route_user)
       }
         $scope.route_user = null
       }
     $scope.remove_guest_route = function(index){
           $scope.guest_route.splice(index,1)
       }

        $scope.annonce_init = function(){
         $scope.annonce_categorie = [
                      { value:"0"  , name: "Choisissez une catégorie"},
                      { value:"1"  , name: "-- EMPLOI --"},
                      { value:"11" , id:"cat11" , name:"Offres d'emploi"},
                      { value:"2"  , name:"-- VEHICULES --"},
                      { value:"21" , id:"cat21" , name:"Voitures"       },
                      { value:"22" , id:"cat22" , name:"Motos"          },
                      { value:"23" , id:"cat23" , name:"Caravaning"     },
                      { value:"24" , id:"cat24" , name:"Utilitaires"    },
                      { value:"25" , id:"cat25" , name:"Equipement Auto"    },
                      { value:"26" , id:"cat26" , name:"Equipement Moto"    },
                      { value:"27" , id:"cat27" , name:"Equipement Caravaning"    },
                      { value:"28" , id:"cat28" , name:"Nautisme"    },
                      { value:"29" , id:"cat29" , name:"Equipement Nautisme"    },
                      { value:"3"  , name:"-- IMMOBILIER --"    },
                      { value:"31" , id:"cat31" , name:"Ventes immobilières"    },
                      { value:"32" , id:"cat32" , name:"Locations"    },
                      { value:"33" , id:"cat33" , name:"Colocations"    },
                      { value:"34" , id:"cat34" , name:"Bureaux &amp; Commerces"    },
                      { value:"4"  , name:"-- VACANCES --"    },
                      { value:"41" , id:"cat41" , name:"Locations &amp; Gîtes"    },
                      { value:"42" , id:"cat42" , name:"Chambres d hôtes"    },
                      { value:"43" , id:"cat43" , name:"Campings"    },
                      { value:"44" , id:"cat44" , name:"Hôtels"    },
                      { value:"45" , id:"cat45" , name:"Hébergements insolites"    },
                      { value:"5"  , name:"-- MULTIMEDIA --"    },
                      { value:"51" , id:"cat51" , name:"Informatique"    },
                      { value:"52" , id:"cat52" , name:"Consoles &amp; Jeux vidéo"    },
                      { value:"53" , id:"cat53" , name:"Image &amp; Son"    },
                      { value:"54" , id:"cat54" , name:"Téléphonie"    },
                      { value:"6"  , name:"-- MAISON --"    },
                      { value:"61" , id:"cat61" , name:"Ameublement"    },
                      { value:"62" , id:"cat62" , name:"Electroménager"    },
                      { value:"63" , id:"cat63" , name:"Arts de la table"    },
                      { value:"64" , id:"cat64" , name:"Décoration"    },
                      { value:"65" , id:"cat65" , name:"Linge de maison"    },
                      { value:"66" , id:"cat66" , name:"Bricolage"    },
                      { value:"67" , id:"cat67" , name:"Jardinage"    },
                      { value:"7"  , name:"--SHOPPING--"    },
                      { value:"71" , id:"cat71" , name:"Vêtements"    },
                      { value:"72" , id:"cat72" , name:"Chaussures"    },
                      { value:"73" , id:"cat73" , name:"Accessoires &amp; Bagagerie"    },
                      { value:"74" , id:"cat74" , name:"Montres &amp; Bijoux"    },
                     { value:"8"   , name:"-- LAYETTE --"    },
                      { value:"81" , id:"cat81" , name:"Equipement bébé"    },
                      { value:"82" , id:"cat82" , name:"Vêtements bébé"    },
                      { value:"9"  , name:"-- LOISIRS --"    },
                      { value:"91" , id:"cat91" , name:"DVD / Films"    },
                      { value:"92" , id:"cat92" , name:"CD / Musique"    },
                      { value:"93" , id:"cat93" , name:"Livres"    },
                      { value:"94" , id:"cat94" , name:"Animaux"    },
                      { value:"95" , id:"cat95" , name:"Vélos"    },
                      { value:"96" , id:"cat96" , name:"Sports &amp; Hobbies"    },
                      { value:"97" , id:"cat97" , name:"Instruments de musique"    },
                      { value:"98" , id:"cat98" , name:"Collection"    },
                      { value:"99" , id:"cat99" , name:"Jeux &amp; Jouets"    },
                      { value:"9A" , id:"cat9A" , name:"Vins &amp; Gastronomie"    },
                      { value:"A"  , name:"-- MATERIEL PROFESSIONNEL --"    },
                      { value:"A1" , id:"catA1" , name:"Matériel Agricole"    },
                      { value:"A2" , id:"catA2" , name:"Transport - Manutention"    },
                      { value:"A3" , id:"catA3" , name:"BTP - Chantier Gros-oeuvre"    },
                      { value:"A4" , id:"catA4" , name:"Outillage - Matériaux 2nd-oeuvre"    },
                      { value:"A5" , id:"catA5" , name:"Équipements Industriels"},
                      { value:"A6" , id:"catA6" , name:"Restauration - Hôtellerie"    },
                      { value:"A7" , id:"catA7" , name:"Fournitures de Bureau"    },
                      { value:"A8" , id:"catA8" , name:"Commerces &amp; Marchés"    },
                      { value:"A9" , id:"catA9" , name:"Matériel Médical"    },
                      { value:"B"  , name:"-- SERVICES --"    },
                      { value:"B1" , id:"catB1" , name:"Prestations de services"    },
                      { value:"B2" , id:"catB2" , name:"Billetterie"    },
                      { value:"B3" , id:"catB3" , name:"Evénements"    },
                      { value:"B4" , id:"catB4" , name:"Cours particuliers"    },
                      { value:"B5" , id:"catB5" , name:"Covoiturage"    },
                      { value:"C"  , name:"-- -- --"    },
                      { value:"C1" , id:"catC1" , name:"Autres"},
                 ]

             $scope.annonce_images = [
               {label:"photo principale", name:"image1"},
               {label:"photo 2", name:"image2"},
               {label:"photo 3", name:"image3"},
               {label:"photo 4", name:"image4"},
             ]

              $scope.myCroppedImage=[];
             Restangular.one("locations/user_locations.json?user_id=1").get().then(function(locs){
             $scope.user_addresse = locs
             })
        }

     $scope.handle_image_click = function(index){

       angular.element(document.querySelector('#file_'+ index +'_image')).on('change', $scope.handle_image_load );

     }

     $scope.handle_image_load = function(evt){
          $scope.activeImage = ''
           $scope.activeCroppedImage = ''

          var file=evt.currentTarget.files[0];
          var reader = new FileReader();
           reader.onload = function (evt) {

              $scope.$apply(function($scope){
                $scope.activeImage=evt.target.result;
              });
            };
            reader.readAsDataURL(file);
            $scope.image_crop_modal = $uibModal.open({
               templateUrl: 'app/templates/modals/show_crop_2.html',
               size : 'md',
               backdrop:'static',
               scope:$scope,
              windowClass:"partage",
               controller : 'LocalisationsController',
             });
     }


       $scope.deposer_annonce = function(){
         $scope.depose_annonce_modal = $uibModal.open({
            templateUrl: 'app/templates/modals/depose_annonce_3.html',
            size : 'md',
            backdrop:'static',
            scope: $scope,
           windowClass:"partage",
            controller : 'LocalisationsController',
          });
       }

       $scope.close_deposer_annonce = function(){
           $scope.depose_annonce_modal.close()
       }
       $scope.close_crop_image_annonce = function(){

         $scope.image_crop_modal.close()
       }
       $scope.on_crop_validate = function(){
             $scope.myCroppedImage[$scope.myCroppedImage.length ] = $scope.activeCroppedImage
             $scope.close_crop_image_annonce();
       }
       $scope.close_cropped_in_annonce = function(index){
             $scope.myCroppedImage[index] = ''
             angular.element(document.querySelector('#file_'+ index +'_image')).on('change', $scope.handle_image_load );

       }
       $scope.create_third_part_location = function(){
         $scope.etape_creation = 0 ;
         $scope.third_part_annonce_modal = $uibModal.open({
            templateUrl: 'app/templates/modals/create_thirdpart_location.html',
            size : 'md',
            backdrop:'static',
            scope: $scope,
           windowClass:"partage",
            controller : 'LocalisationsController',
          });
       }
       $scope.get_cpn_area = function(){
         $scope.etape_creation = 0 ;
         $scope.get_cpn_modal = $uibModal.open({
            templateUrl: 'app/templates/modals/get_cpn_area.html',
            size : 'md',
            backdrop:'static',
            scope: $scope,
           windowClass:"partage",
            controller : 'LocalisationsController',
          });
       }

       $scope.cpn_init = function(){
         leafletData.getMap($scope).then(function(map){
            $scope.map = map
             $scope.map.zoomControl.remove()
             map.setView([3.86785, 11.52088], 16);
             $scope.add_menu_to_cpn($scope.map) ;
             //console.log($scope.subdivision[8])

             })
       }

       $scope.add_menu_to_cpn = function(map){
         var mapMenu = new L.Map.ContextMenu(map)

     mapMenu.addItem({ text: 'recuperer votre cpn zone', callback: function(e){$scope.get_cpn_code(e) } })
     mapMenu.addHooks()

       }
       $scope.get_cpn_code = function(e){
         var arrondissement = $scope.get_arrondissement_of(e.latlng)

       }
       $scope.get_arrondissement_of = function(latlng){
          $scope.request_area(latlng,function(data){
               var name = data["elements"][0].tags.name.trim() ;
               var region = $scope.subdivision[8][name]
               var points = $scope.parse_polygon_points(region["points"])
               var lines = L.polyline(points)
               //  console.log(lines.getLatLngs());
               //$scope.transforme_polyline_to_polygone(lines.getLatLngs())
               var bounds = lines.getBounds() ;
               $scope.map.fitBounds(bounds);
               L.rectangle(bounds,{color:"#00bb00"}).addTo($scope.map)
               L.circle(bounds.getSouthWest()).addTo($scope.map).bindPopup("south West")
               L.circle(bounds.getNorthWest()).addTo($scope.map).bindPopup("North West")
               L.circle(bounds.getSouthEast()).addTo($scope.map).bindPopup("South Est")
               L.circle(bounds.getNorthEast()).addTo($scope.map).bindPopup("North Est")
               $scope.cpn_draw_area(bounds,{latlng:latlng, cog:data["elements"][0].tags["ref:COG"].trim()})
               lines.addTo($scope.map)
          })

       }

       $scope.transforme_polyline_to_polygone = function(polyline){
         var lines = polyline;
       //   var active_line = lines[0] ;
       // for(var i = 0 ; i < lines.length ; i++){
       //     active_line =lines[i]
       //   for(var j = 1 + i ; j < lines.length ; j++){
       //     if($scope.succede_lines(active_line,lines[j])){
       //       lines[i+1] = lines[j]
       //       break
       //     }
       //    }
       //  }
       //  return lines;
          var latlngs = [] ;
               _.each(lines,function(el){

                   _.each(el,function(latlng){
                     latlngs.push(latlng)
                   })
               })
               latlngs.push(latlngs[0])

           var polygone = L.polygon(latlngs,{color:"#bb0000"})
              polygone.addTo($scope.map)
     }

     $scope.remove_duplicate_latlngs = function(el){
       return el

     }

     $scope.succede_lines = function(l1,l2){
       var debut_first_line = l1[0],
       fin_first_line = l1[l1.length - 1],
       debut_second_line = l2[0],
       fin_second_line = l2[l2.length - 1]
       succede = false ;
       if(debut_first_line.equals(debut_second_line)){
         succede = true;
       }
       if(debut_first_line.equals(fin_second_line)){
         succede = true;
       }
       if(fin_first_line.equals(debut_second_line)){
         succede = true;
       }
       if(fin_first_line.equals(fin_second_line)){
         succede = true;
       }
       return succede;
     }



       $scope.cpn_draw_area = function(bounds,obj){
         var cog = $scope.modifier_cog(obj.cog);
         var  sw = bounds.getSouthWest(),
              ne = bounds.getNorthEast(),
              lat_debut = sw.lat ,
              pas = 118 ,
              start_lat =  Math.floor(lat_debut) + Math.floor((lat_debut - Math.floor(lat_debut))*pas)/pas,
              lat_fin = ne.lat ,
              lon_debut = sw.lng ,
              start_lon =  Math.floor(lon_debut) + Math.floor((lon_debut - Math.floor(lon_debut))*pas)/pas,
              lon_fin = ne.lng ;


              precision = 0.00000001,

              zone = [];
         for(var i = start_lat ; i < lat_fin ; i += 1/pas){
           for(var j= start_lon ; j < lon_fin; j += 1/pas){
                     var paire_lat = Math.round((i-start_lat)*pas)
                     var paire_lng = Math.round((j-start_lon)*pas)
                     var paire = $scope.pairing($scope.pairing(Math.floor(obj.latlng.lat),Math.floor(obj.latlng.lng)) , $scope.pairing(paire_lat,paire_lng))
                   zone.push({geom:[[i,j],[i+(1/pas)- precision ,j+ (1/pas) -precision]], cpn : paire.toString(16).padStart(6 ,"0")})
                  }
               }


            _.each(zone,function(el){

              var z = L.rectangle(el.geom, {color: '#'+el.cpn , weight: 1 }).addTo($scope.map).bindPopup("CPN: "+cog+"-"+ el.cpn)
            })
         //console.log(zone.length)
         //    console.log(L.PolyUtil.geodesicArea(z.getLatLngs()[0]))
       }

   $scope.pairing = function(i,j){
     return ((i>=j) ? (i*j + i +j) : (j*j + i));
   }

   $scope.modifier_cog =function(cog){
     // will be change leter
     // CE:CENTRE , NO:NORD ,ES:EST , LT:LITTORAL , SU :SUD , SW = SUD-OUEST
     // NW:NORD-OUEST , OU:OUEST , AD:ADAMOUA , EN:EXTREME-NORD

     var regions = {
       ce:0,es:7,no:8,lt:1,su:5,sw:4,en:9,ad:6,nw:3,ou:2
     }



     var region = regions[cog.substring(2,0).toLowerCase()];
     var depart = parseInt(cog.substring(2,4)).toString(16);
     var arron = parseInt(cog.substring(4,6)).toString(16);
     return ""+region+""+depart+""+arron ;;
   }

   $scope.get_admin_name = function(n){
     var name = undefined;
     var regions = {
       0:"ce",7:"es",8:"no",1:"lt",5:"su",4:"sw",9:"en",6:"ad",3:"nw",2:"ou"
     }
     var cog = ""+n ;
     var r = regions[parseInt(cog.substring(1,0))].toUpperCase();
     var d = "0"+cog.substring(1,1)
     var a = "0"+cog.substring(1,2)
         cog = cog + d + a ;
   var admins = [{"name":"Mfoundi","ref:COG":"CE01"},{"name":"Diamaré","ref:COG":"EN01"},{"name":"Logone-et-Chari","ref:COG":"EN02"},{"name":"Mayo-Danay","ref:COG":"EN03"},{"name":"Mayo-Kani","ref:COG":"EN04"},{"name":"Mayo-Sava","ref:COG":"EN05"},{"name":"Mayo-Tsanaga","ref:COG":"EN06"},{"name":"Bénoué","ref:COG":"NO01"},{"name":"Faro","ref:COG":"NO03"},{"name":"Mayo-Louti","ref:COG":"NO02"},{"name":"Mayo-Rey","ref:COG":"NO04"},{"name":"Djérem","ref:COG":"AD04"},{"name":"Faro-et-Déo","ref:COG":"AD05"},{"name":"Mayo-Banyo","ref:COG":"AD02"},{"name":"Mbéré","ref:COG":"AD03"},{"name":"Vina","ref:COG":"AD01"},{"name":"Boumba-et-Ngoko","ref:COG":"ES02"},{"name":"Haut-Nyong","ref:COG":"ES03"},{"name":"Kadey","ref:COG":"ES04"},{"name":"Lom-et-Djérem","ref:COG":"ES01"},{"name":"Haute-Sanaga","ref:COG":"CE03"},{"name":"Lekié","ref:COG":"CE06"},{"name":"Mbam-et-Inoubou","ref:COG":"CE07"},{"name":"Mbam-et-Kim","ref:COG":"CE08"},{"name":"Méfou-et-Afamba","ref:COG":"CE09"},{"name":"Méfou-et-Akono","ref:COG":"CE10"},{"name":"Nyong-et-Kéllé","ref:COG":"CE02"},{"name":"Nyong-et-Foumou","ref:COG":"CE04"},{"name":"Nyong-et-So'o","ref:COG":"CE05"},{"name":"Dja-et-Lobo","ref:COG":"SU02"},{"name":"Mvila","ref:COG":"SU01"},{"name":"Océan","ref:COG":"SU03"},{"name":"Vallée-du-Ntem","ref:COG":"SU04"},{"name":"Moungo","ref:COG":"LT02"},{"name":"Nkam","ref:COG":"LT03"},{"name":"Sanaga-Maritime","ref:COG":"LT04"},{"name":"Wouri","ref:COG":"LT01"},{"name":"Bamboutos","ref:COG":"OU02"},{"name":"Haut-Nkam","ref:COG":"OU04"},{"name":"Hauts-Plateaux","ref:COG":"OU08"},{"name":"Nkoung-Khi","ref:COG":"OU07"},{"name":"Menoua","ref:COG":"OU05"},{"name":"Mifi","ref:COG":"OU01"},{"name":"Ndé","ref:COG":"OU06"},{"name":"Noun","ref:COG":"OU03"},{"name":"Boyo","ref:COG":"NW06"},{"name":"Bui","ref:COG":"NW02"},{"name":"Donga-Mantung","ref:COG":"NW03"},{"name":"Menchum","ref:COG":"NW05"},{"name":"Mezam","ref:COG":"NW01"},{"name":"Momo","ref:COG":"NW04"},{"name":"Ngoketunjia","ref:COG":"NW07"},{"name":"Fako","ref:COG":"SW01"},{"name":"Kupe-Muanenguba","ref:COG":"SW06"},{"name":"Lebialem","ref:COG":"SW03"},{"name":"Manyu","ref:COG":"SW02"},{"name":"Meme","ref:COG":"SW04"},{"name":"Ndian","ref:COG":"SW05"},{"name":"Yaoundé I","ref:COG":"CE0101"},{"name":"Yaoundé III","ref:COG":"CE0103"},{"name":"Yaoundé IV","ref:COG":"CE0104"},{"name":"Yaoundé VI","ref:COG":"CE0106"},{"name":"Campo","ref:COG":"SU0302"},{"name":"Bertoua I","ref:COG":"ES0101"},{"name":"Bertoua II","ref:COG":"ES0106"},{"name":"Douala I","ref:COG":"LT0101"},{"name":"Douala II","ref:COG":"LT0102"},{"name":"Douala V","ref:COG":"LT0105"},{"name":"Yaoundé VII","ref:COG":"CE0107"},{"name":"Yaoundé V","ref:COG":"CE0105"},{"name":"Yaoundé II","ref:COG":"CE0102"},{"name":"Edzendouan","ref:COG":"CE0907"},{"name":"Akono","ref:COG":"CE1002"},{"name":"Darak","ref:COG":"EN0209"},{"name":"Blangoua","ref:COG":"EN0206"},{"name":"Hilé - Alifa","ref:COG":"EN0208"},{"name":"Fotokol","ref:COG":"EN0207"},{"name":"Makary","ref:COG":"EN0202"},{"name":"Goulfey","ref:COG":"EN0204"},{"name":"Kousséri","ref:COG":"EN0201"},{"name":"Logone-Birni","ref:COG":"EN0203"},{"name":"Waza","ref:COG":"EN0205"},{"name":"Zina","ref:COG":"EN0210"},{"name":"Mora","ref:COG":"EN0501"},{"name":"Kolofata","ref:COG":"EN0503"},{"name":"Tokombéré","ref:COG":"EN0502"},{"name":"Mozogo","ref:COG":"EN0606"},{"name":"Koza","ref:COG":"EN0603"},{"name":"Soulèdé-Roua","ref:COG":"EN0607"},{"name":"Mokolo","ref:COG":"EN0601"},{"name":"Mogodé","ref:COG":"EN0606"},{"name":"Hina","ref:COG":"EN0604"},{"name":"Bourha","ref:COG":"EN0602"},{"name":"Pétté","ref:COG":"EN0105"},{"name":"Bogo","ref:COG":"EN0103"},{"name":"Dargala","ref:COG":"EN0108"},{"name":"Maroua III","ref:COG":"EN0107"},{"name":"Maroua I","ref:COG":"EN0101"},{"name":"Maroua II","ref:COG":"EN0106"},{"name":"Meri","ref:COG":"EN0102"},{"name":"Ndoukoula","ref:COG":"EN0109"},{"name":"Gazawa","ref:COG":"EN0104"},{"name":"Moulvoudaye","ref:COG":"EN0404"},{"name":"Touloum","ref:COG":"EN0406"},{"name":"Dziguilao","ref:COG":"EN0407"},{"name":"Guidiguis","ref:COG":"EN0403"},{"name":"Kaélé","ref:COG":"EN0401"},{"name":"Moutourwa","ref:COG":"EN0405"},{"name":"Mindif","ref:COG":"EN0402"},{"name":"Maga","ref:COG":"EN0304"},{"name":"Kai-Kai","ref:COG":"EN0311"},{"name":"Guémé","ref:COG":"EN0307"},{"name":"Yagoua","ref:COG":"EN0301"},{"name":"Guéré","ref:COG":"EN0303"},{"name":"Gobo","ref:COG":"EN0308"},{"name":"Wina","ref:COG":"EN0306"},{"name":"Datchéka","ref:COG":"EN0309"},{"name":"Tchatibali","ref:COG":"EN0310"},{"name":"Kalfou","ref:COG":"EN0305"},{"name":"Kar-Hay","ref:COG":"EN0302"},{"name":"Figuil","ref:COG":"NO0203"},{"name":"Guider","ref:COG":"NO0201"},{"name":"Mayo-Oulo","ref:COG":"NO0203"},{"name":"Baschéo","ref:COG":"NO0110"},{"name":"Dembo","ref:COG":"NO0105"},{"name":"Pitoa","ref:COG":"NO0103"},{"name":"Bibemi","ref:COG":"NO0102"},{"name":"Lagdo","ref:COG":"NO0104"},{"name":"Ngong","ref:COG":"NO0106"},{"name":"Touroua","ref:COG":"NO0112"},{"name":"Mayo-Hourna","ref:COG":"NO0109"},{"name":"Gachiga","ref:COG":"NO0111"},{"name":"Garoua I","ref:COG":"NO0101"},{"name":"Garoua II","ref:COG":"NO0107"},{"name":"Garoua III","ref:COG":"NO0108"},{"name":"Béka","ref:COG":"NO0302"},{"name":"Poli","ref:COG":"NO0302"},{"name":"Rey-Bouba","ref:COG":"NO0402"},{"name":"Madingring","ref:COG":"NO0404"},{"name":"Touboro","ref:COG":"NO0403"},{"name":"Tcholliré","ref:COG":"NO0401"},{"name":"Djohong","ref:COG":"AD0303"},{"name":"Ngaoui","ref:COG":"AD0304"},{"name":"Meiganga","ref:COG":"AD0301"},{"name":"Dir","ref:COG":"AD0302"},{"name":"Bélel","ref:COG":"AD0103"},{"name":"Ngan'ha","ref:COG":"AD0107"},{"name":"Nyambaka","ref:COG":"AD0108"},{"name":"Martap","ref:COG":"AD0104"},{"name":"Mbé","ref:COG":"AD0102"},{"name":"Ngaoundéré I","ref:COG":"AD0101"},{"name":"Ngaoundéré II","ref:COG":"AD0105"},{"name":"Ngaoundéré III","ref:COG":"AD0106"},{"name":"Kontcha","ref:COG":"AD0504"},{"name":"Mayo-Baléo","ref:COG":"AD0502"},{"name":"Tignère","ref:COG":"AD0501"},{"name":"Galim-Tignère","ref:COG":"AD0503"},{"name":"Banyo","ref:COG":"AD0201"},{"name":"Bankim","ref:COG":"AD0202"},{"name":"Mayo-Darlé","ref:COG":"AD0203"},{"name":"Ngaoundal","ref:COG":"AD0402"},{"name":"Tabati","ref:COG":"AD0401"},{"name":"Bétaré-Oya","ref:COG":"ES0102"},{"name":"Garoua-Boulaï","ref:COG":"ES0104"},{"name":"Bélabo","ref:COG":"ES0103"},{"name":"Diang","ref:COG":"ES0105"},{"name":"Ngoura","ref:COG":"ES0108"},{"name":"Mandjou","ref:COG":"ES0107"},{"name":"Ouli","ref:COG":"ES0407"},{"name":"Kétté","ref:COG":"ES0403"},{"name":"Batouri","ref:COG":"ES0401"},{"name":"Kentzou","ref:COG":"ES0404"},{"name":"Ndélélé","ref:COG":"ES0402"},{"name":"Mbang","ref:COG":"ES0405"},{"name":"Nguélébok","ref:COG":"ES0406"},{"name":"Gari-Gombo","ref:COG":"ES0203"},{"name":"Yokadouma","ref:COG":"ES0201"},{"name":"Salapoumbé","ref:COG":"ES0204"},{"name":"Mouloundou","ref:COG":"ES0202"},{"name":"Ngoyla","ref:COG":"ES0307"},{"name":"Messock","ref:COG":"ES0312"},{"name":"Lomié","ref:COG":"ES0303"},{"name":"Somalomo","ref:COG":"ES0314"},{"name":"Mindourou","ref:COG":"ES0313"},{"name":"Atok","ref:COG":"ES0309"},{"name":"Messaména","ref:COG":"ES0304"},{"name":"Abong-Mbang","ref:COG":"ES0301"},{"name":"Angossas","ref:COG":"ES0308"},{"name":"Doumaintang","ref:COG":"ES0310"},{"name":"Dimako","ref:COG":"ES0306"},{"name":"Doumé","ref:COG":"ES0302"},{"name":"Mboma","ref:COG":"ES0311"},{"name":"Nguelemendouka","ref:COG":"ES0305"},{"name":"Yoko","ref:COG":"CE0802"},{"name":"Ngambé-Tikar","ref:COG":"CE0803"},{"name":"Ngoro","ref:COG":"CE0804"},{"name":"Ntui","ref:COG":"CE0801"},{"name":"Mbangassina","ref:COG":"CE0805"},{"name":"Minta","ref:COG":"CE0302"},{"name":"Bibey","ref:COG":"CE0305"},{"name":"Nsem","ref:COG":"CE0307"},{"name":"Nanga-Eboko","ref:COG":"CE0301"},{"name":"Lembe","ref:COG":"CE0306"},{"name":"Nkoteng","ref:COG":"CE0304"},{"name":"Mbandjock","ref:COG":"CE0303"},{"name":"Ayos","ref:COG":"CE0402"},{"name":"Kobdombo","ref:COG":"CE0404"},{"name":"Akonolinga","ref:COG":"CE0401"},{"name":"Mengang","ref:COG":"CE0405"},{"name":"Endom","ref:COG":"CE0403"},{"name":"Esse","ref:COG":"CE0902"},{"name":"Afanloum","ref:COG":"CE0905"},{"name":"Olanguina","ref:COG":"CE0906"},{"name":"Awaé","ref:COG":"CE0903"},{"name":"Soa","ref:COG":"CE0904"},{"name":"Nkolafamba","ref:COG":"CE0908"},{"name":"Mfou","ref:COG":"CE0901"},{"name":"Dzeng","ref:COG":"CE0502"},{"name":"Nkol-Métet","ref:COG":"CE0506"},{"name":"Mbalmayo","ref:COG":"CE0501"},{"name":"Akoéman","ref:COG":"CE0504"},{"name":"Mengueme","ref:COG":"CE0505"},{"name":"Ngomedzap","ref:COG":"CE0503"},{"name":"Bikok","ref:COG":"CE1004"},{"name":"Ngoumou","ref:COG":"CE1001"},{"name":"Mbankomo","ref:COG":"CE1003"},{"name":"Lobo","ref:COG":"CE0609"},{"name":"Okala","ref:COG":"CE0607"},{"name":"Evodoula","ref:COG":"CE0604"},{"name":"Monatélé","ref:COG":"CE0601"},{"name":"Sa'a","ref:COG":"CE0602"},{"name":"Ebebda","ref:COG":"CE0605"},{"name":"Elig-Mfomo","ref:COG":"CE0606"},{"name":"Obala","ref:COG":"CE0603"},{"name":"Batchenga","ref:COG":"CE0608"},{"name":"Deuk","ref:COG":"CE0705"},{"name":"Bafia","ref:COG":"CE0701"},{"name":"Kon-Yambetta","ref:COG":"CE0708"},{"name":"Bokito","ref:COG":"CE0702"},{"name":"Kiiki","ref:COG":"CE0707"},{"name":"Nitoukou","ref:COG":"CE0709"},{"name":"Makenene","ref:COG":"CE0706"},{"name":"Ndikiniméki","ref:COG":"CE0703"},{"name":"Makak","ref:COG":"CE0202"},{"name":"Bondjock","ref:COG":"CE0209"},{"name":"Matomb","ref:COG":"CE0206"},{"name":"Bot-Makak","ref:COG":"CE0203"},{"name":"Nguibassal","ref:COG":"CE0210"},{"name":"Ngog-Mapubi","ref:COG":"CE0205"},{"name":"Dibang","ref:COG":"CE0207"},{"name":"Biyouha","ref:COG":"CE0208"},{"name":"Messondo","ref:COG":"CE0204"},{"name":"Éséka","ref:COG":"CE0201"},{"name":"Mintom","ref:COG":"SU0206"},{"name":"Djoum","ref:COG":"SU0202"},{"name":"Oveng","ref:COG":"SU0207"},{"name":"Meyomessi","ref:COG":"SU0208"},{"name":"Sangmélima","ref:COG":"SU0201"},{"name":"Meyomessala","ref:COG":"SU0205"},{"name":"Zoétélé","ref:COG":"SU0204"},{"name":"Bengbis","ref:COG":"SU0203"},{"name":"Mvangan","ref:COG":"SU0103"},{"name":"Biwong-Bulu","ref:COG":"SU0106"},{"name":"Ebolowa II","ref:COG":"SU0108"},{"name":"Mengong","ref:COG":"SU0105"},{"name":"Ngoulémakong","ref:COG":"SU0102"},{"name":"Ebolowa I","ref:COG":"SU0101"},{"name":"Efoulan","ref:COG":"SU0107"},{"name":"Biwong-Bané","ref:COG":"SU0104"},{"name":"Ambam","ref:COG":"SU0401"},{"name":"Kyé-Ossi","ref:COG":"SU0404"},{"name":"Ma'an","ref:COG":"SU0402"},{"name":"Olamzé","ref:COG":"SU0403"},{"name":"Mvengue","ref:COG":"SU0305"},{"name":"Lolodorf","ref:COG":"SU0303"},{"name":"Bipindi","ref:COG":"SU0307"},{"name":"Akom II","ref:COG":"SU0304"},{"name":"Lokoundjé","ref:COG":"SU0308"},{"name":"Kribi I","ref:COG":"SU0301"},{"name":"Kribi II","ref:COG":"SU0307"},{"name":"Niété","ref:COG":"SU0309"},{"name":"Ndom","ref:COG":"LT0404"},{"name":"Nyanon","ref:COG":"LT0411"},{"name":"Massok","ref:COG":"LT0410"},{"name":"Ngambé","ref:COG":"LT0402"},{"name":"Pouma","ref:COG":"LT0403"},{"name":"Ngwei","ref:COG":"LT0409"},{"name":"Édéa I","ref:COG":"LT0401"},{"name":"Édéa II","ref:COG":"LT0407"},{"name":"Dizangué","ref:COG":"LT0405"},{"name":"Dibamba","ref:COG":"LT0408"},{"name":"Mouanko","ref:COG":"LT0406"},{"name":"Douala VI","ref:COG":"LT0106"},{"name":"Douala III","ref:COG":"LT0103"},{"name":"Douala IV","ref:COG":"LT0104"},{"name":"Yingui","ref:COG":"LT0302"},{"name":"Yabassi","ref:COG":"LT0301"},{"name":"Ndobian","ref:COG":"LT0304"},{"name":"Nkondjock","ref:COG":"LT0304"},{"name":"Bonaléa","ref:COG":"LT0212"},{"name":"Dibombari","ref:COG":"LT0203"},{"name":"Loum","ref:COG":"LT0206"},{"name":"Mbanga","ref:COG":"LT0202"},{"name":"Mombo","ref:COG":"LT0213"},{"name":"Penja","ref:COG":"LT0209"},{"name":"Manjo","ref:COG":"LT0204"},{"name":"Ebone","ref:COG":"LT0208"},{"name":"Baré","ref:COG":"LT0207"},{"name":"Mélong","ref:COG":"LT0205"},{"name":"Nkongsamba I","ref:COG":"LT0201"},{"name":"Nkongsamba II","ref:COG":"LT0210"},{"name":"Nkongsamba III","ref:COG":"LT0211"},{"name":"Tiko","ref:COG":"SW0103"},{"name":"Limbé III","ref:COG":"SW0106"},{"name":"Limbé I","ref:COG":"SW0101"},{"name":"Limbé II","ref:COG":"SW0105"},{"name":"Buea","ref:COG":"SW0102"},{"name":"Idenau","ref:COG":"SW0107"},{"name":"Muyuka","ref:COG":"SW0104"},{"name":"Mbonge","ref:COG":"SW0402"},{"name":"Kumba I","ref:COG":"SW0401"},{"name":"Kumba III","ref:COG":"SW0405"},{"name":"Kumba II","ref:COG":"SW0404"},{"name":"Konye","ref:COG":"SW0403"},{"name":"Bangem","ref:COG":"SW0601"},{"name":"Tombel","ref:COG":"SW0603"},{"name":"Nguti","ref:COG":"SW0602"},{"name":"Toko","ref:COG":"SW0509"},{"name":"Mudemba","ref:COG":"SW0501"},{"name":"Isanguele","ref:COG":"SW0504"},{"name":"Idabato","ref:COG":"SW0505"},{"name":"Kombo-Abedimo","ref:COG":"SW0507"},{"name":"Kombo-Itindi","ref:COG":"SW0506"},{"name":"Bamusso","ref:COG":"SW0503"},{"name":"Dikome-Balue","ref:COG":"SW0508"},{"name":"Ekondo-Titi","ref:COG":"SW0502"},{"name":"Eyumodjock","ref:COG":"SW0203"},{"name":"Mamfé","ref:COG":"SW0201"},{"name":"Tinto","ref:COG":"SW0204"},{"name":"Akwaya","ref:COG":"SW0202"},{"name":"Alou","ref:COG":"SW0303"},{"name":"Menji","ref:COG":"SW0301"},{"name":"Wabane","ref:COG":"SW0302"},{"name":"Bangangté","ref:COG":"OU0601"},{"name":"Tonga","ref:COG":"OU0603"},{"name":"Bazou","ref:COG":"OU0602"},{"name":"Foumbot","ref:COG":"OU0302"},{"name":"Malentouen","ref:COG":"OU0304"},{"name":"Foumban","ref:COG":"OU0301"},{"name":"Massangam","ref:COG":"OU0305"},{"name":"Kouoptamo","ref:COG":"OU0308"},{"name":"Koutaba","ref:COG":"OU0306"},{"name":"Bangourain","ref:COG":"OU0307"},{"name":"Njimom","ref:COG":"OU0309"},{"name":"Magba","ref:COG":"OU0303"},{"name":"Bafoussam I","ref:COG":"OU0101"},{"name":"Bafoussam II","ref:COG":"OU0102"},{"name":"Bafoussam III","ref:COG":"OU0103"},{"name":"Pete-Bandjoun","ref:COG":"OU0702"},{"name":"Bayangam","ref:COG":"OU0701"},{"name":"Demding","ref:COG":"OU0703"},{"name":"Bamendjou","ref:COG":"OU0801"},{"name":"Baham","ref:COG":"OU0801"},{"name":"Bangou","ref:COG":"OU0803"},{"name":"Batié","ref:COG":"OU0804"},{"name":"Bana","ref:COG":"OU0402"},{"name":"Bandja","ref:COG":"OU0403"},{"name":"Bafang","ref:COG":"OU0401"},{"name":"Bakou","ref:COG":"OU0407"},{"name":"Banka","ref:COG":"OU0405"},{"name":"Banwa","ref:COG":"OU0406"},{"name":"Kékem","ref:COG":"OU0404"},{"name":"Dschang","ref:COG":"OU0501"},{"name":"Fokoué","ref:COG":"OU0504"},{"name":"Fongo-Tongo","ref:COG":"OU0506"},{"name":"Santchou","ref:COG":"OU0503"},{"name":"Nkong-Zem","ref:COG":"OU0505"},{"name":"Penka-Michel","ref:COG":"OU0502"},{"name":"Batcham","ref:COG":"OU0202"},{"name":"Babadjou","ref:COG":"OU0204"},{"name":"Galim","ref:COG":"OU0203"},{"name":"Mbouda","ref:COG":"OU0201"},{"name":"Balikumbat","ref:COG":"NW0703"},{"name":"Ndop","ref:COG":"NW0701"},{"name":"Babessi","ref:COG":"NW0702"},{"name":"Jakiri","ref:COG":"NW0202"},{"name":"Mbiame","ref:COG":"NW0203"},{"name":"Kumbo","ref:COG":"NW0201"},{"name":"Nkum","ref:COG":"NW0206"},{"name":"Elak","ref:COG":"NW0204"},{"name":"Nkor","ref:COG":"NW0205"},{"name":"Bali","ref:COG":"NW0102"},{"name":"Santa","ref:COG":"NW0105"},{"name":"Bamenda I","ref:COG":"NW0101"},{"name":"Bamenda II","ref:COG":"NW0106"},{"name":"Bamenda III","ref:COG":"NW0107"},{"name":"Bafut","ref:COG":"NW0104"},{"name":"Tubah","ref:COG":"NW0103"},{"name":"Batibo","ref:COG":"NW0402"},{"name":"Mbengwi","ref:COG":"NW0401"},{"name":"Andek","ref:COG":"NW0404"},{"name":"Nijkwa","ref:COG":"NW0403"},{"name":"Widikum-Boffé","ref:COG":"NW0405"},{"name":"Belo","ref:COG":"NW0603"},{"name":"Fundong","ref:COG":"NW0601"},{"name":"Njinikom","ref:COG":"NW0604"},{"name":"Fonfuka","ref:COG":"NW0602"},{"name":"Benakuma","ref:COG":"NW0504"},{"name":"Wum","ref:COG":"NW0501"},{"name":"Zhoa","ref:COG":"NW0503"},{"name":"Furu-Awa","ref:COG":"NW0502"},{"name":"Misaje","ref:COG":"NW0305"},{"name":"Nkambe","ref:COG":"NW0301"},{"name":"Ako","ref:COG":"NW0303"},{"name":"Ndu","ref:COG":"NW0304"},{"name":"Nwa","ref:COG":"NW0302"},{"name":"Bassamba","ref:COG":"OU0604"},{"name":"Ombessa","ref:COG":"CE0704"}]
       _.each(admins,function(el){
          if(el["ref:COG"] = cog ){
            name = el
          }
       })
     return el
   }

   $scope.timer_waiting = function(id,t,fn){
     var init = 0 ;

   }


      $scope.close_third_part_annonce = function(){

        $scope.third_part_annonce_modal.close()
        if($scope.etape_creation == 3){
          $scope.step_finish("select_addresse")
        }
      }



       $scope.before_step_finish = function(){
         $scope.close_third_part_annonce()
       }
       $scope.thrid_part_init = function(){
           $scope.loadMap({scope:$scope , third : true} );
       }

       $scope.step_next = function(){

         $scope.etape_creation += 1
         // call send data
         if($scope.etape_creation == 3){

           $scope.enregistrer_third_after({
             auth : $scope.auth_third_part($scope.user)
           });
         }
       }

       $scope.auth_third_part = function(u){
         return "kerawa_"+u.email ;
       }

       $scope.step_prev = function(){

         $scope.etape_creation -= 1;
       }
       $scope.step_checked = function(i){
         if($scope.etape_creation > i){
           return "checked";
         }
         if($scope.etape_creation == i){
           return "active";
         }

       }
       $scope.step_active = function(i){

         if($scope.etape_creation == i){
           return "active";
         }

       }

     $scope.validate_location = function(){
       return ($scope.localisation.name == undefined || $scope.localisation.mairie == undefined);
     }
     $scope.validate_information = function(){
       if($scope.user == undefined ){
         return true
       }else{
         return ($scope.user.pseudo == undefined || $scope.user.email == undefined || $scope.user.phone == undefined);
         }
     }

      $scope.disable_step = function(){

           if($scope.etape_creation == 0){
             if ($scope.localisation == undefined){
               return true;
             }else{
               return $scope.localisation.building_id == undefined;
             }
           }
           if($scope.etape_creation == 1){

             return $scope.validate_location();
           }

           if($scope.etape_creation == 2){
             return $scope.validate_information();
           }


      }

    $scope.step_finish = function (dom_id){
      var value = angular.element(document.querySelector('#'+dom_id))
      if(value){
        value[0].options.add(new Option($scope.$scope.current_addresse.location_address,$scope.current_addresse.location_id,'selected'))
              }
           }

      $scope.show_init_location_search = function(){

          if($scope.not_founded_localisation){
            return false;
          }


           if($scope.disable_step()){
             return ($scope.init_location_search);
           }else{
             return false;
           }


      }




       // Third part create end




       // recuperer de location

       $scope.location_init = function(){
         // tells that location search is init
         $scope.init_location_search = true
         $scope.show = false;
        $scope.localisation = {} ;
        $scope.types = ["prive" , "public" ]
        $scope.categories = [
          "bar","restaurant","restaurant rapide" , "glacier" , "ecole" , "crêche", "Institut superieur","librairie","centre d'apprentissage","université","laverie","location vehicules",
          "gare routiere","parking","Banque-DAB","DAB","banque","bureau de change","centre culturel","salle de jeux","salle de fêtes","salle de cinema", "boite de nuit",
          "foyer social","toilette publique","clinique","cabinet dentaire","hopital","centre de santé","pharmacie","veterinaire",
          "prison","boulangerie","marché","poisonnerie","mairie","gendarmerie","centre de formation","ministere","delegation ministerielle",
          "magasin-electromenager","magasin-pret à porter","magasin-jouets","magasin","commisariat","Salon de coiffure","Quincaillerie",
          "sapeur pompier","entreprise"
        ]
        // retire puisqu on est dans le meme controleur
       // $scope.current_place = current_place ;
        $scope.localisation.lat =$scope.current_place.lat ;
        $scope.localisation.lng = $scope.current_place.lng ;

        var query3 =  "[out:json];way(around:50,"+ $scope.localisation.lat+","+$scope.localisation.lng+")['building'];(._; >;); out;"

            $scope.map.zoomControl.remove();
             $scope.map.setView([$scope.current_place.lat, $scope.current_place.lng], 18);
          //  L.marker([$scope.current_place.lat, $scope.current_place.lng],{draggable : true }).addTo(map)
           //.bindPopup('position encours...')
        //.openPopup();
        svrOverPass.requestOsm(query3,function(data){

              $scope.show = true ;
          // retrouve la maison la plus proche definit clique sur la maison que l'on estime que c'est a notre
              var element = svrOverPass.getWays(data.elements) ;
             console.log(element)
              var points = {}
               _.each(element,function(el,i){ points[i] =  _.map(el.nodes,function(e){
                return [e.lat , e.lon ] ;
              }) })
               var active = null ;
              var polygons = [] ;

              _.each(points, function(ele,j){
                var polygon_interne = L.polygon(ele,{color:"#00bb00" , smoothFactor : 1})
                    var inside = $scope.isMarkerInsidePolygon(polygon_interne,$scope.localisation)
                    if(inside){
                       polygons.push({poly:polygon_interne , id : j})
                    }
                  })

                      //var filter_poylgons = $scope.check_inside(polygons,$scope.localisation)
                      if(polygons.length < 1){
                        $scope.not_founded_localisation = true ;
                      }else{
                        $scope.precise_regions($scope.current_place , $scope.map)
                        var i = polygons[0]["id"]
                        var polygon = polygons[0]["poly"].addTo($scope.map)
                        $scope.element = polygon
                        $scope.parent_scope = $rootScope
                        $scope.element.bindPopup($compile('<div>Annulez cette selection <br/><a style="color:#fff" ng-click="remove_selection(parent_scope)" class="btn btn-warning btn-xs"><i class="fa fa-close"></i> Annuler </a></div>')($scope)[0])
                        $scope.localisation.building_id = element[i].id
                        $scope.localisation.name = element[i].tags.name
                        $scope.localisation.categorie = element[i].tags.amenity


                      }

        })


       }
     $scope.remove_selection = function(s){
         _.each($scope.lines,function(el,i){
           el.removeFrom($scope.map);
         })
         $scope.element.removeFrom($scope.map);
         $scope.fermer();
     }
      $scope.fermer = function(){
          //  $scope.positionne(null,$scope.principal)

           $scope.instance_location_modal.close()
      }
     $scope.close_partage_exist = function(){
       $scope.modal_instance_exist.close()
     }
     $scope.close_partage_notexist = function(){
       $scope.modal_instance_notexist.close()
     }
      $scope.enregistrer = function(){
        // verifie si la maison est deja cree
        Restangular.one("/locations/partage/"+$scope.localisation.building_id+".json").get().then(function(data){
        if(data.length > 0){
          console.log(data[0].user_id)
            console.log(data[0].user_id != null)
        $scope.user_exit  = (data[0].user_id != null)

        $scope.modal_instance_exist = $uibModal.open({
             templateUrl: 'app/templates/modals/create_addresse_existing.html',
             size : 'sm',
             windowClass:"partage",
             controller : "LocalisationsController"
           });

        }else{
          $scope.modal_instance_notexist = $uibModal.open({
               templateUrl: 'app/templates/modals/create_addresse_notexisting.html',
               size : 'sm',
               windowClass:"partage",
               controller : "LocalisationController",
               resolve :  {
                 current_place : function(){
                   return $scope.localisation;
                 }
               }
             });


        }
        },function(error){

        })
      }


      $scope.enregistrer_after = function(){
         // creer et enregistrer une localisation

           Restangular.all("road_buildings.json").post(
             {road_building: {
                         building_id: $scope.localisation.building_id ,
                         road_id: $scope.localisation.road_id ,
                         position: $scope.localisation.position
                   },
              location:{
                quartier:$scope.place_point[10]+"_"+$scope.place_point["10_id"],
                arrondissement:$scope.place_point[8]+"_"+$scope.place_point["8_id"],
                departement:$scope.place_point[6]+"_"+$scope.place_point["6_id"],
                region:$scope.place_point[4]+"_"+$scope.place_point["4_id"],
                rue:$scope.proche.name+"_"+$scope.proche.id,
                building:$scope.localisation.building_id,
                name: $scope.localisation.name ,
                description: $scope.localisation.description ,
                type_id:   $scope.localisation.type,
                mairie: $scope.localisation.mairie,
                lng:   $scope.localisation.lng,
                lat:   $scope.localisation.lat,
                user_id: 1,
                created_nodes:JSON.stringify($scope.element.getLatLngs()),
                position:($scope.localisation.position == 0 ? 0 : $scope.localisation.position / Math.abs($scope.localisation.position))
              }
         }
       ).then(function(c){
                   console.log(c)
             var addr ="<div>"+ c.pid + "#" + $scope.proche.name + "<br/>" + $scope.localisation.mairie +"<br/>"+$scope.place_point[10]+";"+ $scope.place_point[8] + "<br/>" +  $scope.place_point[6] +  ";" +  $scope.place_point[4]
                  addr += "<hr/><div class='routing_tools'><a  href='#' uib-popover='favoris' popover-trigger='mouseenter' popover-placement='bottom' ng-click='add_location_favourite("+$scope.localisation.building_id+","+ c.location_id+")'><i class='fa fa-map-pin'></i></a><a href='#' uib-popover='partager' popover-trigger='mouseenter' popover-placement='bottom' ng-click=partage_location("+$scope.localisation.building_id+")><i class='fa fa-share-alt'></i></a></div></div>"
                  addr = $compile(addr);

            line= L.polygon($scope.element.getLatLngs()).addTo($rootScope.current_scope.map)

            line.bindPopup(addr($rootScope.current_scope)[0]).openPopup();
            // Donner le nom de la rue

           }, function(error){console.log(error)})
           $uibModalInstance.close($scope.localisation)
      }


         $scope.enregistrer_third_after = function(obj){
            // creer et enregistrer une localisation
              $scope.current_addresse = undefined
              Restangular.all("road_buildings.json").post(
                {road_building: {
                            building_id: $scope.localisation.building_id ,
                            road_id: $scope.localisation.road_id ,
                            position: $scope.localisation.position
                      },
                 location:{
                   quartier:$scope.place_point[10]+"_"+$scope.place_point["10_id"],
                   arrondissement:$scope.place_point[8]+"_"+$scope.place_point["8_id"],
                   departement:$scope.place_point[6]+"_"+$scope.place_point["6_id"],
                   region:$scope.place_point[4]+"_"+$scope.place_point["4_id"],
                   rue:$scope.proche.name+"_"+$scope.proche.id,
                   building:$scope.localisation.building_id,
                   name: $scope.localisation.name ,
                   description: $scope.localisation.description ,
                   type_id:   $scope.localisation.type,
                   mairie: $scope.localisation.mairie,
                   lng:   $scope.localisation.lng,
                   lat:   $scope.localisation.lat,
                   user_id: 0 ,
                   guest:obj.auth,
                   created_nodes:JSON.stringify($scope.element.getLatLngs()),
                   position:($scope.localisation.position == 0 ? 0 : $scope.localisation.position / Math.abs($scope.localisation.position))
                 }
            }
          ).then(function(c){
                     $scope.current_addresse = c


              }, function(error){console.log(error)})

         }

      $scope.partager = function(s){
             $scope.share_link = s
            // create localisation
            // Link for sharing this view
            $uibModal.open({
              templateUrl: 'app/templates/modals/partage.html',
              scope : $scope ,
              size : 'sm',
              controller : "LocalisationsController",
            })
      }

      $scope.precise_regions = function(latlng,map){
        var query ="[out:json];is_in("+latlng.lat+","+latlng.lng+"); area._[admin_level] ; out; "
        var query2 = "[out:json];way(around:100,"+latlng.lat+","+latlng.lng+")['highway'~'secondary|primary|residential|trunk|tertiary'];(._; >;); out;"
        //var query3 =  "[out:json];way(around:10,"+latlng.lat+","+latlng.lng+")['building'];(._; >;); out;"

        var place_point = {} ;
        var route = []
        svrOverPass.requestOsm(query,function(data){
          _.each(data.elements , function(e){
               place_point[e.tags.admin_level] = e.tags.name
               place_point[e.tags.admin_level+"_id"] = e.id
            })
           $scope.place_point = place_point
           svrOverPass.requestOsm(query2,function(data){
             var element = svrOverPass.getWays(data.elements) ;
             var points = {}
             var lines = []
              _.each(element,function(el,i){ points[i] =  _.map(el.nodes,function(e){
               return [e.lat , e.lon ] ;
             }) })
              var active = null ;
             _.each(points, function(ele,i){
                     var line =  L.polyline(ele,{color:"#993300" , smoothFactor : 1}).addTo($scope.map) ;
                       line.id = element[i].id
                       line.name = element[i].tags.name
                     lines.push(line) ;

                   // line.on("click",function(el){
                   //       el.target.setStyle({color:"#003399"})
                   //       var popupel ="<h3>"+ element[i].id + "</h3><br/>";
                   //       _.each(element[i].noms,function(t ,i){
                   //         popupel += i + ":" + t +"<br/>"
                   //       })
                   //     el.target.bindPopup(popupel).openPopup();
                   //      })


             })
             var proche = L.LineUtil.proche(lines,latlng) ;
             var orientation = L.LineUtil.pointOrientation(proche.line,latlng)
              $scope.lines = lines
               proche.line.setStyle({color:"#0000bb"})
               proche.line.bindPopup("<div class=''>La plus proche rue</div><div class=''>"+proche.line.name+"</div>")
               $scope.proche = proche.line
               $scope.localisation.road_id =proche.line.id
               $scope.localisation.position  = orientation[1]
        });

      })
      }

      $scope.isMarkerInsidePolygon = function ( poly,p) {
        var polyPoints = poly.getLatLngs()[0];
        var x = p.lat, y = p.lng;

        var inside = false;
        for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
            var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };

   $scope.request_area = function(e,fn){
     var query ="[out:json];is_in("+e.lat+","+e.lng+"); area._[admin_level=8] ; out; "
        svrOverPass.requestOsm(query,function(data){
           fn(data);
        })
   }

    $scope.check_single_inside_polyline = function(polyline,p){
      var bounds = L.latLngBounds(polyline.getLatLngs())
           var rect = L.rectangle(bounds,{color :'#'+Math.floor(Math.random()*16777215).toString(16)})
        rect.addTo($scope.map)
    }
    $scope.check_single_inside = function(polygon,p){
      return polygon.getBounds().contains(p)

    }

    $scope.check_inside = function(polygon,p){
      var polys = []
      _.each(polygon,function(poly,e){
          var inside =$scope.check_single_inside(poly["poly"],e)
          if(inside){
            polys.push(poly)
          }
      })

      // si inisde est vrai approfondir avec raster
        return $scope.filter_check_inside(polys);
    }


    // CONFIG CONTROLLER PARAMETER
      $scope.create_app3_addresse = function(){
        // appname
        // id_name
        $scope.etape_creation = 0
        $scope.create_app3_url = "/app/templates/modals/create_thirdpart_location.html"
        if(  window.opener){
          window.opener.postMessage("Hello parent Frame",'*')
        }


      }
      $scope.create_app3_zone = function(){
        // appname
        // id_name
        $scope.create_app3_url = "/app/templates/modals/get_cpn_area.html"


      }



    $scope.filter_check_inside = function(polys){
      // filter if we have polys.length > 1
      console.log( polys[0]["poly"].getLatLngs()) ;

    console.log( L.PolyUtil.geodesicArea(polys[0]["poly"].getLatLngs()[0])) ;
    if(polys.length < 2){
        return polys;
    }
    // return $scope.order_check_inside(polys);
    }

    $scope.order_check_inside = function(polygons){
      var polys = polygons
      var i = 1
      var active = polys[0]
      for(var j = 1 ; j < polys.length ; j++){
      if (Polygon.plus_petit(polys[j]["poly"],active["poly"])){
        active = poly[j]
       }
      }
      polys[0] = active
      return polys;
    }




$scope.create_app3_addresse();

}])
