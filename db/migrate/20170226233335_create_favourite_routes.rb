class CreateFavouriteRoutes < ActiveRecord::Migration
  def change
    create_table :favourite_routes do |t|
      t.integer :user_id
      t.text :url

      t.timestamps
    end
  end
end
