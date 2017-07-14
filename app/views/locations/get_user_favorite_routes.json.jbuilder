json.array!(@allroutes) do |route|
  json.extract! route[:favourites], :id, :user_id, :url
  unless route[:routes].nil?
  json.extract! route[:routes] , :routes , :alternative
  end
  #json.url location_url(location, format: :json)
end
