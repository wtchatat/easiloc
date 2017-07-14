class CreateNoeuds < ActiveRecord::Migration
  def change
    create_table :noeuds do |t|
      t.string :lat
      t.string :lng
      t.date :tstamp
      t.integer :nid , :limit => 8
      t.integer :zone , :limit => 8

      t.timestamps
    end
  end
end
