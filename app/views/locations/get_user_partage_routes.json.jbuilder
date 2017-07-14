json.array!(@allroutes) do |route|
  json.(route[:personne] , :url , :user_id)
  json.guests route[:personne][:guests], :email , :name , :relance

   unless route[:routes].nil?
  json.(route[:routes] , :routes , :alternative)
  end
  #json.url location_url(location, format: :json)
end
