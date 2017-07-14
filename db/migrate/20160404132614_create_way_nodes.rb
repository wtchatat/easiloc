class CreateWayNodes < ActiveRecord::Migration
  def change
    create_table :way_nodes do |t|
      t.integer :wid
      t.integer :nid

      t.timestamps
    end
  end
end
