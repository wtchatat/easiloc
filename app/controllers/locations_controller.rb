class LocationsController < ApplicationController
  before_action :set_location, only: [:show, :edit, :update, :destroy]

  respond_to :html , :json

  def index
    @locations = Location.all
    respond_with(@locations)
  end

  def show
    respond_with(@location)
  end

  def set_user
    @location = Location.find_by_id(params[:loc_id])
    @location.user_id = params[:user_id] unless @location.nil?
    @location.nature = params[:nature] unless @location.nil?
    @location.save unless @location.nil?
    @location = @location || Location.new
  end
def route_partage
  @guests = []
  params[:users].each do |user|
    guest = Guest.new({:email => user["email"] , :name => user["name"] , :user_id => params[:user_id] , :url => params[:url]} )
    guest.save
    @guests.push guest

  end
inform_guest(@guests)
end



def place_search

    @locations = Location.where("rue LIKE ?", "%#{params[:query]}%")

end

def landing
    @existed = false
  invite_params= params[:invite]
  @invite = Invite.where(:email => invite_params[:email]).first
unless @invite.nil?
    @existed = true
  end
  unless @existed
    @invite = Invite.new(:name => invite_params[:name] , :email => invite_params[:email])
    @invite.save
  end
  # send mail
 Partage.landing_invite(@invite,@existed).deliver
 @count = Invite.all.size
end

def count_invite
  @count = Invite.all.size
end

def  getadmin
  cities = City.all
  @departements = cities.select do  |x|
            _t = x.ttext.split(";")
            _t.include?("admin_level@6") &&  _t.join("@").split("@").include?("name")&& _t.join("@").split(":").join("@").include?("COG")
       end
  @arrondissements = cities.select do  |x|
              _t = x.ttext.split(";")
              _t.include?("admin_level@8") &&  _t.join("@").split("@").include?("name")&& _t.join("@").split(":").join("@").include?("COG")
            end

    @departements = (@departements + @arrondissements).map do |x|
      t  = x.ttext
      e = {}
      elements  = t.split(";")
      elements.each do |el|
        _els = el.split("@")
         e[_els[0].to_sym] = _els[1]
      end
       e
    end


end

def location_partage
  @guests_location = []
  puts params[:users]
  params[:users].each do |user|
    guest = GuestLocation.new({:email => user["email"] , :name => user["name"] , :user_id => params[:user_id] , :url => params[:url]} )
    guest.save
    @guests_location.push guest
   end
  inform_location_guest(@guests_location)
end
def inform_location_guest guests
  guests.each do |g|
    Partage.partage_location(current_user,g).deliver
  end
end
def inform_guest guests
  guests.each do |g|
    Partage.partage_route(current_user,g).deliver
  end
end

def set_user_favorite_route
  @favourite_route = FavouriteRoute.new
  @favourite_route.user_id = params[:user_id]
  @favourite_route.url = params[:text]
  @favourite_route.save!
end

def get_user_favorite_routes
    @favourite_routes = FavouriteRoute.where(:user_id => params[:user_id])
    @routes = Route.where(:user_id => params[:user_id])
    @allroutes = []
    @favourite_routes.each do |x|
      routes = @routes.select{|y| y.url == x.url }
      routes = routes.empty? ? nil : routes[0]
      @allroutes.push({:favourites => x , :routes => routes})
    end
end

def get_user_partage_routes
  @partage_routes = Guest.where(:user_id => params[:user_id])
  @partage_routes = @partage_routes.group_by{|x| x.url }
  @guests = []
  @partage_routes.each do |k,v|
      element = {}
      element[:url] = k
      element[:user_id] = v[0][:user_id]
      element[:guests] = []
      v.group_by{|p| p.email}.each do |k2,v2|
          element[:guests].push({:email => k2 , :name => v2[0][:name] , :relance => v2.size })
      end
    @guests.push(element)
  end



  @routes = Route.where(:user_id => params[:user_id])
  @allroutes = []
  @guests.each do |x|
    routes = @routes.select{|y| y.url == x[:url] }
    routes = routes.empty? ? nil : routes[0]
    @allroutes.push({:personne => x , :routes => routes})
  end
end
#save location coming from automatique create when user clique on an particular area

def save_location
  location = params[:location]
  @location = Location.new(save_location_params)
  @location.save
end

def set_user_favorite_location
  @favourite_location = FavouriteLocation.new
  @favourite_location.user_id = params[:user_id]
  @favourite_location.building_id = params[:building_id]
  @favourite_location.location_id = params[:location_id]
  @favourite_location.save
end

def get_user_routes
    @routes = Route.where(:user_id => params[:user_id])
end

def save_user_route
   exit_route = Route.where(:url => params[:url]).select{|x| x.user_id == params[:user_id]} ;
   exit_route = exit_route.empty? ? nil : exit_route
   @route = exit_route ||  Route.new({:url => params[:url],:routes => params[:routes],:alternative => params[:alternative], :user_id => params[:user_id]}) ;
   @route.save!

end

def get_user_favorite_locations
  @favourite_locations = FavouriteLocation.where(:user_id => params[:user_id])
  @locations = Location.where(:id => @favourite_locations.map{|x| x.location_id }.uniq)
end

def get_user_suivi_locations
  @suivi_locations = SuivisLocation.where(:guest_id => params[:user_id])
  @locations = Location.where(:id => @suivi_locations.map{|x| x.location_id }.uniq)
end

def user_locations
  @locations = Location.where(:user_id => params[:user_id])

end

def favorite_route
  @favourite_routes = FavouriteRoute.where(:user_id => params[:user_id])

end

  def get_user
    @location = Location.find_by_id(params[:id]) || Location.new
  end

  def user
    @locations = Location.where(:user_id => params[:id])
  end

  def partage
     @locations = Location.where(:building => params[:id])
  end

  def new
    @location = Location.all
  end

  def search
  @locations = Location.all
  end

  def filter
    @locations = Location.where(:building => params[:points])
  end


  def place
      # lat = params[:lat]
      # lng = params[:lng]
      # # condition d 'existence' de lat et lng
      # zp = pairing_zone(lat.to_f,lng.to_f)
      # zp_voisin = pairing_zone_voisin(zp)
      # @place = {:steets => [] , :buildings => [] , :pois => [] }
  end
  def create
    @location = Location.new(location_params)
    @location.save

    respond_with(@location.proche(100) , :location => locations_path(@location)  )

  end

  def update
    @location.update(location_params)
    respond_with(@location.proche(10))
  end

  def destroy
    @location.destroy
    respond_with(@location)
  end

  private
    def set_location
      @location = Location.find(params[:id])
    end

    def save_location_params
      params.require(:location).permit(:quartier, :arrondissement,:departement,:region,:rue,:building,:user_id,:created_nodes,:position)
    end

    def location_params
      params.require(:location).permit(:name, :description, :type_id, :lng, :lat)
    end
end
