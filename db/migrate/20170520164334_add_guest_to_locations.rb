class AddGuestToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :guest, :string
  end
end
