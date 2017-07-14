#json.extract! @location, :id,:address, :lng, :lat
json.array!(@guests) do |guest|
  json.extract! guest, :id
end
