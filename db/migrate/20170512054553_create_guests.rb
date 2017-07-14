class CreateGuests < ActiveRecord::Migration
  def change
    create_table :guests do |t|
      t.string :email
      t.string :name
      t.integer :user_id
      t.text :url

      t.timestamps
    end
  end
end
