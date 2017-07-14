class CreateCities < ActiveRecord::Migration
  def change
    create_table :cities do |t|
      t.string :tname
      t.integer :tid , :limit => 8
      t.string :ttype
      t.string :tparent
      t.text :points
      t.integer :zone , :limit => 8

      t.timestamps
    end
  end
end
