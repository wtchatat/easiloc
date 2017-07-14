json.array!(@favourite_routes) do |favourite_route|
  json.extract! favourite_route, :id, :user_id, :url
  #json.url location_url(location, format: :json)
end
