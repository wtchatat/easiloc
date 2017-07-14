#json.extract! @location, :id,:address, :lng, :lat
json.array!(@locations) do |location|
  json.extract! location, :id,:address, :lng, :lat , :texte
  json.url location_url(location, format: :json)
end
