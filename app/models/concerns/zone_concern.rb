module ZoneConcern
  extend ActiveSupport::Concern

  included do

  end

  module ClassMethods

  end

    def voisin(n)
      position = unpairing_zone(self.zone)
      zones = orientation(n).collect{|s| step(position,s) }.collect do |x|
        puts x.inspect
        r =  pairing(pairing(x[0][0],x[0][1]),pairing(x[1][0],x[1][1]))
        puts r.inspect
        r
      end
      zones
    end
    #content_box return [minlat, minlon , maxlat ,maxlog
     def content_box
       p = unpairing_zone(self.zone)
       [p[0][0] + p[1][0].to_f/32 , p[0][1] + p[1][1].to_f/32 , p[0][0] + (p[1][0] - 1 ).to_f/32 , p[0][1] + (p[1][1] - 1).to_f/32]
     end
  # PAIRING ZONE

  def pairing x,y
    (x >= y ?  (x*x + x + y) : (y*y + x))
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

 #END PAIRING

    def step( zp , x , p = 32)
     #recupere un voisin
     # ajoute le pas a plus petite unité
     m1 = add_metrage(zp[0][0] , zp[1][0] , x[0] )

     m2 = add_metrage(zp[0][1] , zp[1][1] , x[1] )

     [ [m1[0] ,m2[0]] , [m1[1] ,m2[1]] ]

    end
    def add_metrage(a,b,c,p=32)
       _a = a
       _b = b
       _c = c


       if ( (_b+_c) == 0)
         return [ _a-1 , 32 ] ;
      end
      if ( (_b+_c) == 33)
         return [_a+1 , 1] ;
      end
       return [_a , _b +_c] ;
    end
    def orientation(n)
    b = (0..n).to_a
    c = (b + b.collect{|x| x*(-1)}).uniq.repeated_permutation(2).to_a
    c
    end



end
