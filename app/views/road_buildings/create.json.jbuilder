json.extract! @road_building, :id, :pid , :road_id, :building_id, :position, :created_at, :updated_at
json.location_id @location.id
json.location_address @location.address
json.location_points @location.points
json.place @place.name

#devra ajouter place user 
