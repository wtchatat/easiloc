class AddIndexToWaynode < ActiveRecord::Migration
  def change
      add_index(:way_nodes , [:nid , :wid])
  end
end
