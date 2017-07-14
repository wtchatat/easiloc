class CreateNds < ActiveRecord::Migration
  def change
    create_table :nds do |t|
      t.integer :ref
      t.integer :way_id

      t.timestamps
    end
  end
end
