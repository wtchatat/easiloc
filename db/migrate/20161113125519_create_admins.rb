class CreateAdmins < ActiveRecord::Migration
  def change
    create_table :admins do |t|
      t.integer :rid 
      t.integer :level
      t.string :cog
      t.text :tags
      t.text :member_nodes
      t.text :member_ways

      t.timestamps
    end
  end
end
