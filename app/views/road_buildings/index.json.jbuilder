json.array!(@road_buildings) do |road_building|
  json.extract! road_building, :id, :pid, :road_id, :building_id, :position
  json.url road_building_url(road_building, format: :json)
end
