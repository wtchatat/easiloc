class Attaches < ActiveRecord::Migration

  def change
    create_table :attaches do |t|
      t.string :filename
      t.string :title
      t.references :attachable, polymorphic: true
      t.timestamps null: false
    end
  end

end
