class CreateRelations < ActiveRecord::Migration
  def change
    create_table :relations do |t|
      t.integer :visible
      t.date :tstamp
      t.integer :rid

      t.timestamps
    end
  end
end
