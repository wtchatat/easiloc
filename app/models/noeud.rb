class Noeud < ActiveRecord::Base
 #extend TagConcern
 #attr_accessor :tid
  class << self

    def pairing x,y
      (x > y ?  (x*x + x + y) : (y*y + x))
    end

    def unpairing z
      _z = Math.sqrt(z).floor
      value = z - _z*_z - _z
      value < 0 ?  [value + _z, _z] : [_z,value]
   end

   def pairing_zone x,y
        ent_x = x.floor
        ent_y = y.floor
        rest_x = ((x - ent_x)*32).ceil
        rest_y = ((y - ent_y)*32).ceil
        pairing(pairing(ent_x,ent_y) , pairing(rest_x, rest_y))
   end

   def unpairing_zone z
     t =   unpairing(z)
     t[0]  = unpairing(t[0])
     t[1]  = unpairing(t[1])
     t
   end

  end
  def tid
    self.nid
  end

end
