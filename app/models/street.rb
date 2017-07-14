class Street < ActiveRecord::Base
  include ZoneConcern
  def all_points
     JSON.parse(self.points)
  end
end
