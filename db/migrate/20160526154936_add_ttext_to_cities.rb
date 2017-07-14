class AddTtextToCities < ActiveRecord::Migration
  def change
    add_column :cities, :ttext, :text
  end
end
