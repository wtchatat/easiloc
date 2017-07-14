class CreateSuivisLocations < ActiveRecord::Migration
  def change
    create_table :suivis_locations do |t|
      t.integer :location_id
      t.integer :guest_id
      t.integer :user_id

      t.timestamps
    end
  end
end
