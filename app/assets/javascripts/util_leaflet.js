// search this Polyline for the closest vertex to the given LatLng
// return an object of both that vertex (LatLng instance) and the distance (meters)


if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}

L.LineUtil.proche = function(lines , p ){
  var position = 0 ;
  var distance = 100000000;

  console.log(lines.length)
  for(var i = 0 , ll = lines.length ; i < ll ; i++ ){
         var d = lines[i].closestLayerPoint(lines[i]._map.latLngToLayerPoint(p));
         
        if(!d) continue;

        d = d.distance ;
        if( d >= distance) continue;
          distance = d  ;
          position = i ;
      }

  return {line : lines[position] , distance : distance , point : p }
}

L.LineUtil.pointOrientation = function(line,latlng){
       var p = line._map.latLngToLayerPoint(latlng),
  		    minDistance = Infinity,
		     minPoint = null,
        orientation = null,
		    closest = L.LineUtil._sqClosestPointOnSegment,
		    p1, p2;

		for (var j = 0, jLen =line._parts.length; j < jLen; j++) {
			var points = line._parts[j];

			for (var i = 1, len = points.length; i < len; i++) {
				p1 = points[i - 1];
				p2 = points[i];

				var sqDist = closest(p, p1, p2, true);

				if (sqDist < minDistance) {
					minDistance = sqDist;
					minPoint = closest(p, p1, p2);
          orientation = (p2.x - p1.x)*(p.y - p1.y) - (p2.y - p1.y)*(p.x - p1.x)
				}
			}
		}
		if (minPoint) {
			minPoint.distance = Math.sqrt(minDistance);
		}
		return [minPoint , orientation];
}

// pris dans la library Leaflet.draw

L.PolyUtil.geodesicArea =  function (latLngs) {
		var pointsCount = latLngs.length,
			area = 0.0,
			d2r = Math.PI / 180,
			p1, p2;
  console.log(pointsCount + ":  points")
		if (pointsCount > 2) {
			for (var i = 0; i < pointsCount; i++) {
				p1 = latLngs[i];
				p2 = latLngs[(i + 1) % pointsCount];
				area += ((p2.lng - p1.lng) * d2r) *
						(2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
			}
			area = area * 6378137.0 * 6378137.0 / 2.0;
		}

		return Math.abs(area);
}

L.Polygon.plus_petit = function(p1,p2){
  L.PolyUtil.geodesicArea(p1.getLatLngs());
  L.PolyUtil.geodesicArea(p1.getLatLngs());
  return true;
}
