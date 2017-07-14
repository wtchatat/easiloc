class AddEtatToAnnonces < ActiveRecord::Migration
  def change
    add_column :annonces, :etat, :string
  end
end
