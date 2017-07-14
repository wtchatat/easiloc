(function(){
var module_name = ['app' , 'app-contact']
for(var i = 0 ; i < module_name.length ; i++ ) {
angular.module(module_name[i])
.factory('svrOverPass' , ['osmOverpassAPI',function(osmOverpassAPI){
    var _element = {}
      return {
        requestOsm : function(query,fn,url){
          console.log(url)
          if(url != undefined ){
             console.log("here")
              osmOverpassAPI.url = url ;
          }
          console.log(osmOverpassAPI.url)
          osmOverpassAPI.overpass(query).then(function(e){
            fn(e)
          },function(error){
             console.log(error)
          })
        },
        getNodes: function(data){
          var selected_nodes = _.reject(data, function(e){ return (e.type != "node") ;}) ;
          var nodes = {} ;
          _.each(selected_nodes,function(el){
            nodes[el.id] = el ;
          })
          return nodes;
        },
        getWays: function(data){
          var selected_ways = _.reject(data, function(e){ return (e.type != "way") ;}) ;
          var selected_nodes =this.getNodes(data) ;
          var ways = {} ;
          _.each(selected_ways,function(el){
            _.each(el.nodes,function(ele,i){
              el.nodes[i] = selected_nodes[ele]
            })
            ways[el.id] = el ;
          }) ;
          return ways;
        },
        setPath: function(element,current_map){
          var points = {}
          var lines = []
           _.each(element,function(el,i){ points[i] =  _.map(el.nodes,function(e){
            return [e.lat , e.lon ] ;
          }) })
           var active = null ;
          _.each(points, function(ele,i){
                  var line =  L.polyline(ele,{color:"#993300" , smoothFactor : 1}).addTo(current_map) ;
                  lines.push(line) ;
                 line.on("click",function(el){
                     el.target.setStyle({color:"#003399"})
                     var popupel ="<h3>"+ element[i].id + "</h3><br/>";
                       _.each(element[i].noms,function(t ,i){
                         popupel += i + ":" + t +"<br/>"
                       })
                     el.target.bindPopup(popupel).openPopup();
                     })


          })
          var proche = L.LineUtil.proche(lines,latlng) ;
          proche.line.setStyle({color:"#17b751"})

        },
        setBuilding:function(element,current_map){

          var points = {}
           _.each(element,function(el,i){ points[i] =  _.map(el.nodes,function(e){
            return [e.lat , e.lon ] ;
          }) })
           var active = null ;
          _.each(points, function(ele,i){
                  var polygon =  L.polygon(ele,{color:"#993300" , smoothFactor : 1}).addTo(current_map) ;
                 polygon.on("click",function(el){
                     if (active){

                       active.setStyle({color:"#993300"})
                     }
                     el.target.setStyle({color:"#003399"})
                     var popupel ="<h3>"+ element[i].type +":"+ element[i].id + "</h3><br/>";
                       _.each(element[i].tags,function(t ,i){
                         popupel += i + ":" + t +"<br/>"
                       })
                     el.target.bindPopup(popupel).openPopup();

                     active = el.target ;
                   })
            })

        }


      };

    }])
    }
  })()
