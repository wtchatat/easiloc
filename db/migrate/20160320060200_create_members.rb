class CreateMembers < ActiveRecord::Migration
  def change
    create_table :members do |t|
      t.string :mtype
      t.integer :ref
      t.string :role
      t.integer :rid

      t.timestamps
    end
  end
end
