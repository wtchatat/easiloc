class Way < ActiveRecord::Base

  def points
    all_points = []
    self.way_nodes.each do |n|
        all_points << n.points.first
    end
    all_points
  end

   def way_nodes
      nds = self.nds.split(",")
      nodes = Node.where(:nid => nds ).order("field(nid, #{nds.join ','})")
      #check if polygone and add first point if we have a polygone
      if nds.last == nds.first
        nodes.push(nodes[0])
      end
      nodes
    end

end
