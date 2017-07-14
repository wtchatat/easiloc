class AddIndexToWayNode < ActiveRecord::Migration
  def change
    add_index(:way_nodes , [:wid , :nid])
  end
end
