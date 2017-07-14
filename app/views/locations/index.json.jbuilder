json.array!(@locations) do |location|
  json.extract! location, :id, :name, :description, :type_id, :lng, :lat
  json.url location_url(location, format: :json)
end
