class AddToPoi < ActiveRecord::Migration
  def change
    add_column :pois, :tparent, :string
    add_column :buildings, :tparent, :string
  end
end
