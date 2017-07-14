
#json.array!(@streets) do |street|
  json.extract! @streets, :id , :all_points  , :ttext
  #json.url street_url(street, format: :json)
#end
