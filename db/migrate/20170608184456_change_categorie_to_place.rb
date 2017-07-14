class ChangeCategorieToPlace < ActiveRecord::Migration
  def change
      rename_column :places , :categorie , :rubrique
  end
end
