def list_zone(p , n)
  zones = orientation(n).collect{|x| step(unpairing_zone(p.zone),x) }.collect{|x| pairing(pairing(x[0][0],x[0][1]),pairing(x[1][0],x[1][1]))}
  zones
end

def step( zp , x , p = 32)
 #recupere un voisin
 # ajoute le pas a plus petite unité
 
 zp[1][0] += x[0]
 zp[1][1] += x[1]
 
 # ajoute un pas a la plus grande unité
 
 zp[0][0] +=  zp[1][0]/p.ceil
 zp[0][1] +=  zp[1][1]/p.ceil
 
 # rendre la plus petite unité plus petite de p = 32 
 
 zp[1][0] %= p
 zp[1][1] %= p
 
 zp
 
end

def oreintation(n)
b = (1..n).to_a
c = (b + b.collect{|x| x*(-1)}).compact.repeated_permutation(2).to_a
c
end