class AddIndexToNode < ActiveRecord::Migration
  def change
     add_index(:tags, :tid )
  end
end
