class AddIndexToTag < ActiveRecord::Migration
  def change
    add_index(:nodes, :nid )
    add_index(:ways, :wid )
    add_index(:relations, :rid )
  end
end
