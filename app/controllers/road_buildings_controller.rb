class RoadBuildingsController < ApplicationController
  before_action :set_road_building, only: [:show, :edit, :update, :destroy]

  respond_to :html , :json

  def index
    @road_buildings = RoadBuilding.all
    respond_with(@road_buildings)
  end

  def show
      respond_with(@road_building)
  end

  def new
    @road_building = RoadBuilding.new
    respond_with(@road_building)
  end

  def edit
  end

  def create
    @road_building = RoadBuilding.new(road_building_params)
    @road_building.save
    #creer une methode sur le model RoadBuilding pour sauvegarder  location
    @location = @road_building.find_or_create_location(location_params)
    @place = @road_building.save_place(place_params, @location.id)
    respond_with(@road_building)
  end

  def update
    @road_building.update(road_building_params)
    respond_with(@road_building)
  end

  def destroy
    @road_building.destroy
    respond_with(@road_building)
  end

  


  private
    def set_road_building
      @road_building = RoadBuilding.find(params[:id])
    end

    def road_building_params
      params.require(:road_building).permit(:road_id, :building_id, :position)
    end
    def location_params
        params.require(:location).permit!
    end
    def place_params
        params.require(:place).permit!
    end

end
