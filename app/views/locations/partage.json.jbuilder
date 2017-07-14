json.array!(@locations) do |loc|
  json.extract! loc, :id, :name, :address, :texte ,:description, :type_id, :lng, :lat, :user_id, :created_at, :updated_at ,:points
end
