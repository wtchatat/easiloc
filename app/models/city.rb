class City < ActiveRecord::Base

#   def region(v)
#        c = City.all.select do  |x|
#          _t = x.ttext.split(";")
#          _t.include?("admin_level@#{v}") &&  _t.join("@").split("@").include?("name") && _t.join("@").split("-").include?("2@CM")
#        end
#  end
#  def departement(v)
#       c = City.all.select do  |x|
#         _t = x.ttext.split(";")
#         _t.include?("admin_level@#{v}") &&  _t.join("@").split("@").include?("name")&& _t.join("@").split(":").join("@").include?("COG")
#       end
# end
#
# def arrondissement(v)
#      c = City.all.select do  |x|
#        _t = x.ttext.split(";")
#        _t.include?("admin_level@#{v}") &&  _t.join("@").split("@").include?("name")
#      end
# end
#
# def inside point
#
#   poly = self.all_points
#   poly.each do |p|
#
#   end
#
# end
#
# def rpoints
#     self.tname.to_s.capitalize.constantize.where(:rid => self.tid).first.points
#
# end
#
#
#
#
#  def wn_PnPoly point
#      # add condition to prevent falsy input
#       _poly = self.all_points
#       wn = 0
#       unless _poly.size % 2 == 0
#          _poly << _poly.first
#
#       end
#       n = _poly.size
#       _poly.each_with_index do |e,i|
#         next unless i < (n-1)
#           if e[1].to_f <= point[1].to_f
#             if _poly[i+1][1].to_f > point[1].to_f
#                if is_left(e,_poly[i+1],point) > 0
#                  wn = wn + 1
#                end
#             end
#           else
#             if   _poly[i+1][1].to_f <= point[1].to_f
#               if is_left(e,_poly[i+1],point) < 0
#                 wn = wn - 1
#               end
#             end
#          end
#       end
#       wn % 2 == 1
#  end
#
# # is_left: tests if a point is Left|On|Right of an infinite line.
# #   Input:  three points P0, P1, and P2
# #   Return: >0 for P2 left of the line through P0 and P1
# #            =0 for P2  on the line
# #           <0 for P2  right of the line
#  def is_left p0 , p1 , p2
#    ( (p1[0].to_f - p0[0].to_f) * (p2[1].to_f - p0[1].to_f) - (p2[0].to_f -  p0[0].to_f) * (p1[1].to_f - p0[1].to_f) )
#  end
#

  def all_points
      JSON.parse(self.points)
  end
#   def distance( p1, p2)
#    p = 0.017453292519943295;
#    a = 0.5 - Math.cos((p2[0].to_f - p1[0].to_f) * p)/2 +  Math.cos(p1[0].to_f * p) * Math.cos(p2[0].to_f * p) *  (1 - Math.cos((p2[1].to_f - p1[1].to_f) * p))/2;
#   return 12742 * Math.asin(Math.sqrt(a));
# end
#   def order_points
#        classement = [] ;
#        les_points = self.all_points.select{|x| x.size > 1}
#        actuel_point = les_points.shift
#        classement.push(actuel_point)
#        until les_points.size == 0
#
#         les_points.sort!{|x,y| self.distance(actuel_point.last,y.first) <=> self.distance(actuel_point.last,x.first)}
#         actuel_point = les_points.shift
#         classement.push(actuel_point)
#       end
#       #classement #.flatten(1)
#       all_points
#      end

end
