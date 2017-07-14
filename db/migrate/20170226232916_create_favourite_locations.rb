class CreateFavouriteLocations < ActiveRecord::Migration
  def change
    create_table :favourite_locations do |t|
      t.integer :user_id
      t.integer :location_id
      t.integer :building_id

      t.timestamps
    end
  end
end
