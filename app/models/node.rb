class Node < ActiveRecord::Base
 @tag_loaded = false
 @tags = nil
 def tags
     unless @tag_loaded
         #must add index on nid to speed search --TO DO--
         @tags = Tag.where(:tid => self.nid).select{ |x| x.tname == "node"}
         @tag_loaded = true
      end
      @tags
  end

  ## Give the name of node, return nil or name
  def name
      _name = nil
      self.tags.each do |x|
          if x.tkey == "name"
            _name =  x.tvalue
          end
      end
      _name
   end

   def points
     [[self.lat , self.lng]]
   end

   def has_functionality k , v
         _has_it = false
        self.tags.each do  |x|
            if x.tkey == k && x.tvalue == v
                  _has_it = true
            end
       end
       _has_it
   end


end
