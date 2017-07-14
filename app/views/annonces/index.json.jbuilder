json.array!(@annonces) do |annonce|
  json.extract! annonce, :id , :categorie , :description , :social , :type , :price , :etat
  json.attaches annonce.attaches do |attach|
      json.extract! attach.filename , :url
      json.extract! attach , :title
  end
end
