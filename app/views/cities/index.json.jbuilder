json.array!(@admins) do |city|
  json.extract! city, :id , :level , :points ,  :cog , :nom
  #json.url city_url(city, format: :json)
end
