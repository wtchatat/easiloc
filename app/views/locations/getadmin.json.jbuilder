json.array!( @departements) do |departement|

  json.(departement , :name , :"ref:COG")

end
