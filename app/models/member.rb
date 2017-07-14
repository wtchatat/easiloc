class Member < ActiveRecord::Base

  def points
      all_points = []
     if self.mtype == "node"
        n = Node.where(:nid => self.ref)
        if !n.empty?
          #  n.each{|x| all_points << x.points.first  }
        end
      end
      if self.mtype == "way"
         w = Way.where(:wid => self.ref).order("created_at ASC")
         if !w.empty?
              w.each{|x| all_points += x.points }
         end
      end
      if self.mtype == "relation"
        r = Relation.where(:rid => self.ref)
        if !r.empty?
          #  r.each{|x| all_points = all_points + x.points  }
        end
      end
      all_points
  end


end
