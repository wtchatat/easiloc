class CreateRoutes < ActiveRecord::Migration
  def change
    create_table :routes do |t|
      t.integer :user_id
      t.text :routes
      t.text :url
      t.integer :alternative

      t.timestamps
    end
  end
end
