class Admin < ActiveRecord::Base

  def points

    #points = JSON.load(self.member_ways).map{|x| x.map{|y| JSON.load(y) }}
    self.member_ways
  end
  def center
    cx = 0
    cy = 0
    cz = 0
     pi = Math::PI
     _points = self.points.flatten(1).map do |x|
       lat = x[0]*pi/180
       lon = x[1]*pi/180
       [Math.cos(lat) * Math.cos(lon),Math.cos(lat) * Math.sin(lon), Math.sin(lat)]
     end
     _points.each do |x|
       cx += x[0]
       cy += x[1]
       cz += x[2]
     end
     cx = cx/_points.size unless _points.size == 0
     cy = cy/_points.size  unless _points.size == 0
     cz = cz/_points.size  unless _points.size == 0
     c_lon = Math.atan2(cy, cx)
     c_hyp = Math.sqrt(cx * cx + cy * cy)
     c_lat = Math.atan2(cz, c_hyp)
     [c_lat*180/pi,c_lon*180/pi]
  end


  def is_reg?
     self.level == 4
  end
  def is_dep?
     self.level == 6
  end
  def is_arr?
     self.level == 8
  end
  def is_qua?
     self.level == 10
  end
  def is_country?
     self.level == 2
  end
   def nom
   v = self.tags.split(/\n/).select{|x| x.split(":").index("name")}


    if v.size > 0
      v = v[0].split(":")


      return  v[1].strip! ;
    end
  return "";
   end
   def children
         Admin.where('cog  REGEXP ?', "^#{self.cog}[0-9][1-9]$")
   end

end
