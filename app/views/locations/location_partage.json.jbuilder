#json.extract! @location, :id,:address, :lng, :lat
json.array!(@guests_location) do |guest|
  json.extract! guest, :id
end
