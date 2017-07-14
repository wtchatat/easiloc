class CreateGuestLocations < ActiveRecord::Migration
  def change
    create_table :guest_locations do |t|
      t.string :email
      t.string :name
      t.integer :user_id
      t.text :url

      t.timestamps
    end
  end
end
