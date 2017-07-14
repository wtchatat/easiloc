class CreateStreets < ActiveRecord::Migration
  def change
    create_table :streets do |t|
      t.string :tname
      t.integer :tid , :limit => 8
      t.text :ttext
      t.string :ttype
      t.string :tparent
      t.text :points
      t.integer :zone , :limit => 8 

      t.timestamps
    end
  end
end
