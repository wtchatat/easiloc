class AddMairieToLocation < ActiveRecord::Migration
  def change
    add_column :locations, :mairie, :string
  end
end
