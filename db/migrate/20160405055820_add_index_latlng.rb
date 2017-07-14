class AddIndexLatlng < ActiveRecord::Migration
  def change
    add_index(:nodes , [:lat , :lng])
    add_index(:nodes , [:lng , :lat])
  end
end
