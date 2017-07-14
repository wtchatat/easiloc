class CreateAnnonces < ActiveRecord::Migration
  def change
    create_table :annonces do |t|
      t.string :categorie
      t.string :social
      t.string :type
      t.string :titre
      t.string :price
      t.text :description
      t.integer :adresse_id
      t.integer :zone_id
      t.integer :user_id

      t.timestamps
    end
  end
end
