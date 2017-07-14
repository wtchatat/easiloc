json.array!(@locations) do |loc|
  json.extract! loc, :id, :name, :address, :texte ,:description, :type_id, :lng, :lat, :user_id, :nature , :created_at, :updated_at ,:points
end
