class CreateBuildings < ActiveRecord::Migration
  def change
    create_table :buildings do |t|
      t.string :tname
      t.integer :tid , :limit => 8
      t.string :ttype
      t.text :ttext
      t.text :points
      t.integer :zone ,  :limit => 8

      t.timestamps
    end
  end
end
