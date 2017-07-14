class CreateWays < ActiveRecord::Migration
  def change
    create_table :ways do |t|
      t.integer :visible
      t.date :tstamp
      t.integer :wid

      t.timestamps
    end
  end
end
