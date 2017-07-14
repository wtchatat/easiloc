class RoadBuilding < ActiveRecord::Base
attr_accessor :pid


def pid
   rang = 0
  all = RoadBuilding.where(:road_id => self.road_id)
  all_positive = all.select{|x| x.position.to_i > 0 }
  all_negative = all.select{|x| x.position.to_i < 0 }
  if (self.position.to_i > 0)
    rang = 2*(all_positive.size + 1)
  end
  if(self.position.to_i <= 0 )
      rang = 2*(all_negative.size) + 1
  end
rang
end

def find_or_create_location location
  loc = Location.find_by(:building => location["building"])
  if loc.nil?
  loc = Location.new(location)
  loc.rang = self.pid
  loc.save
  end
  loc
end
def save_place(place , loc_id)
  puts place
  cplace = Place.new(place)
  cplace.location_id = loc_id
  cplace.save
  cplace
end




def attributes
super.merge('pid' => self.pid)
end

end
