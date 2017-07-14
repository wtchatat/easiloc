class AddZoneToNode0 < ActiveRecord::Migration
  def change
    add_column(:nodes , :zone , :integer)
  end
end
