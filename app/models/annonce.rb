class Annonce < ActiveRecord::Base
   has_many :attaches, as: :attachable, dependent: :destroy
end
