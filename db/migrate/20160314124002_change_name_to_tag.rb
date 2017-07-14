class ChangeNameToTag < ActiveRecord::Migration
  def change
    rename_column :tags , :type_id  , :tid
    rename_column :tags , :type_name , :tname
  end
end
