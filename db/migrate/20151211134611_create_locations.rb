class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|
      t.string :name
      t.text :description
      t.integer :type_id
      t.integer :categorie_id
      t.string :lng
      t.string :lat

      t.timestamps
    end
  end
end
