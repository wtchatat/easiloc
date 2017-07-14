class ContactsController < ApplicationController
  # before_action :set_location, only: [:show, :edit, :update, :destroy]
  #
   respond_to :html , :json

  def gmail
      @auth = request.env['omniauth.auth']
  end


  private
    # def set_location
    #   @location = Location.find(params[:id])
    # end
    #
    # def location_params
    #   params.require(:location).permit(:name, :description, :type_id, :lng, :lat)
    # end
end
