class CreateTagPois < ActiveRecord::Migration
  def change
    create_table :tag_pois do |t|
      t.string :tname
      t.integer :tid , :limit => 8
      t.text :ttext
      t.string :ttype
      t.string :tparent

      t.timestamps
    end
  end
end
