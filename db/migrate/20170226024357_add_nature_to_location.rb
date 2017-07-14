class AddNatureToLocation < ActiveRecord::Migration
  def change
    add_column :locations, :nature, :string
  end
end
