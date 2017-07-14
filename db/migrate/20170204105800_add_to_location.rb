class AddToLocation < ActiveRecord::Migration
  def change
    add_column :locations , :quartier ,  :string
    add_column :locations , :arrondissement ,  :string
    add_column :locations , :departement,  :string
    add_column :locations , :region,  :string
    add_column :locations , :rue,  :string
    add_column :locations , :building,  :string
    add_column :locations , :on_map, :integer
    add_column :locations , :created_nodes, :text
    add_column :locations , :position,                                   :integer
    add_column :locations , :rang,  :integer
    add_column :locations , :user_id,  :integer
  end
end
