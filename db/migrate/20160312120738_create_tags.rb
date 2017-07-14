class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :tkey
      t.string :tvalue
      t.string :type_name
      t.integer :type_id

      t.timestamps
    end
  end
end
