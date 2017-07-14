module TagConcern
  extend ActiveSupport::Concern
  @tag_loaded = false
  @tags = nil
  attr_reader :tid
  included do

  end



  module InstanceMethods
    def tags
      unless @tag_loaded
          #must add index on nid to speed search --TO DO--
          @tags = Tag.where(:tid => @tid).select{ |x| x.tname == "node"}
          @tag_loaded = true
       end
       @tags
    end

    def name
        _name = nil
        self.tags.each do |x|
            if x.tkey == "name"
              _name =  x.tvalue
            end
        end
        _name
     end

  end

end






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
