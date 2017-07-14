class Location < ActiveRecord::Base
attr_accessor :address
attr_accessor :points
  def proche(d)
     Location.all.select do |loc|
                distance(self , loc)  < d
     end
  end

def address
  q = self.quartier.to_s.split("_")[0]
  a = self.arrondissement.to_s.split("_")[0]
  d = self.departement.to_s.split("_")[0]
 r = self.region.to_s.split("_")[0]
 s= self.rue_new
 p= self.rang
  "#{p}##{s}<br/> #{q} - #{a} <br/> #{d} - #{r}"
end
def texte
  q = self.quartier.to_s.split("_")[0]
  a = self.arrondissement.to_s.split("_")[0]
  d = self.departement.to_s.split("_")[0]
 r = self.region.to_s.split("_")[0]
 s= self.rue_new
 p= self.rang
  "#{p}##{s} #{q} - #{a}  #{d} - #{r}"
end

def rue_new
  _r = self.rue.to_s.split("_");
  _r[0].to_s == "undefined"  ? "Rue osm_#{_r[1].to_s}" : _r[0].to_s

end

def points
  self.created_nodes
end




  def rad(x)
     x * Math::PI / 180;
  end

  def distance(d1,d2)
      r = 6378137;
      dLat = rad(d2.lat.to_f - d1.lat.to_f);
      dLong = rad(d2.lng.to_f - d1.lng.to_f) ;
      a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(d1.lat.to_f)) * Math.cos(rad(d2.lat.to_f)) * Math.sin(dLong / 2) * Math.sin(dLong / 2)
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      d = r * c;
     return d;
  end

  def attributes
  super.merge('address' => self.address , 'points' => self.points)
  end

end
