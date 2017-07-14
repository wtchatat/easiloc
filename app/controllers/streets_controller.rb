class StreetsController < ApplicationController
  before_action :set_street, only: [:show, :edit, :update, :destroy]

  # GET /streets
  # GET /streets.json
  def index
  #  @streets = Street.all
     lat = params[:lat].to_f
     lng = params[:lng].to_f
     s = Street.new
     zone = s.pairing_zone(lat,lng)
     s.zone = zone
     #voisins = s.voisin(1)
 # if !lat.nil?
 #     #1. Recuperer les routes de la zone
 #         route_zone = Street.where(:zone => zone)
 #    #2 Verifie si route_zone est vide dans ce cas rechercher les
 #    #  route vosine du niveau 1
 #          if route_zone.empty?
 #              voisin = s.voisin(1)
 #              route_zone = Street.where(:zone => voisin)
 #          end
 #    #3 recuperer les routes dans les way
 #          route_way = []
 #          # route_zone.each do |r|
 #          #     route_way.push({:points => Way.where(:wid => r.tid).first.points , :ttext => r.ttext , :id => r.tid})
 #          # end
 #
 #    #4 trier les routse par ordre de raprochement
 #          #route_way_sorted = s.sorted_way(route_way)
 #          @streets =  route_zone
 #  else
    #  @streets = Relation.where(:rid => 5621205).first
      #  city = City.all.select{|x| x.ttext.split(";").include?("admin_level@10") && x.ttext.split(";").join("@").split("@").include?("name") }.last
      #  element = city.tname.classify.constantize.where("#{city.tname[0]}id".to_sym => city.tid).first
      #  name = city.ttext.split(";").join("@").split("@")
      #  index = name.index("name")
       @streets = Street.last
    #  @streets = []
#  end
end

  # GET /streets/1
  # GET /streets/1.json
  def show
    @street = Relation.where(:rid => 2750662).first
  end

  # GET /streets/new
  def new
    @street = Street.new
  end

  # GET /streets/1/edit
  def edit
  end

  # POST /streets
  # POST /streets.json
  def create
    @street = Street.new(street_params)

    respond_to do |format|
      if @street.save
        format.html { redirect_to @street, notice: 'Street was successfully created.' }
        format.json { render :show, status: :created, location: @street }
      else
        format.html { render :new }
        format.json { render json: @street.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /streets/1
  # PATCH/PUT /streets/1.json
  def update
    respond_to do |format|
      if @street.update(street_params)
        format.html { redirect_to @street, notice: 'Street was successfully updated.' }
        format.json { render :show, status: :ok, location: @street }
      else
        format.html { render :edit }
        format.json { render json: @street.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /streets/1
  # DELETE /streets/1.json
  def destroy
    @street.destroy
    respond_to do |format|
      format.html { redirect_to streets_url, notice: 'Street was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_street
      @street = Street.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def street_params
      params[:street]
    end
end
