json.array!(@locations) do |location|
  json.extract! location, :id, :address, :texte, :rang , :rue ,  :type_id, :lng, :lat

end
