class Relation < ActiveRecord::Base

  @tag_loaded = false
  @tags = nil


    def parent
        Member.where(:ref => self.rid).select{|x| x.mtype == "retaion"}
    end
    #recupere les points tableau de points
    def points
       points = []
      Member.where(:rid => self.rid).order("created_at DESC").map{|x| x.points }.each do |p|
         points.push(p)
       end
         points

    end


     def tags
      unless @tag_loaded
        @tags = {}
        Tag.where(:tid => self.rid).select{|x| x.tname == "relation"}.each do |x|
          @tags[x.tkey] =  x.tvalue
        end
        @tag_loaded = true
      end
       @tags
     end


     def is_administrative
        !tags.fetch("boundary" , "").empty?
     end

      def level
        tags.fetch("admin_level" , "").to_i
      end

      def name
        tags.fetch("name" , "")
      end

      def wn_PnPoly point , poly
          # add condition to prevent falsy input
           _poly = poly
           wn = 0
           unless _poly.size % 2 == 0
              _poly << _poly.first
           end
           n = _poly.size
           _poly.each_with_index do |e,i|
             next unless i < (n-1)
               if e[1].to_f <= point[1].to_f
                 if _poly[i+1][1].to_f > point[1].to_f
                    if is_left(e,_poly[i+1],point) > 0
                      wn = wn + 1
                    end
                 end
               else
                 if   _poly[i+1][1].to_f <= point[1].to_f
                   if is_left(e,_poly[i+1],point) < 0
                     wn = wn - 1
                   end
                 end
              end
           end
           wn % 2 == 1
      end

  # is_left: tests if a point is Left|On|Right of an infinite line.
  #   Input:  three points P0, P1, and P2
  #   Return: >0 for P2 left of the line through P0 and P1
  #            =0 for P2  on the line
  #           <0 for P2  right of the line
      def is_left p0 , p1 , p2
        ( (p1[0].to_f - p0[0].to_f) * (p2[1].to_f - p0[1].to_f) - (p2[0].to_f -  p0[0].to_f) * (p1[1].to_f - p0[1].to_f) )
      end


end
