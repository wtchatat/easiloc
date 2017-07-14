json.array!(@locations) do |location|
  json.extract! location, :id, :name, :address, :points, :lng, :lat
  json.url location_url(location, format: :json)
end
