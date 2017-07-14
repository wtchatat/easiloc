class AddColumnToWay < ActiveRecord::Migration
  def change
    add_column :ways, :nds, :text
  end
end
