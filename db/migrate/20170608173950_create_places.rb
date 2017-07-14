class CreatePlaces < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.string :name
      t.text :description
      t.string :categorie
      t.string :type
      t.string :nature
      t.integer :auth_id
      t.integer :location_id
      t.integer :user_id

      t.timestamps
    end
  end
end
