class CreateNodes < ActiveRecord::Migration
  def change
    create_table :nodes do |t|
      t.string :lat
      t.string :lng
      t.integer :visible
      t.date :tstamp
      t.integer :nid

      t.timestamps
    end
  end
end
