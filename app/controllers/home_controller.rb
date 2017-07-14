class HomeController < ApplicationController

  def index
      render layout: layout_name
  end

 def place
   @auth = {"e" => 1}

 end

 def landing
   render layout: false
 end

  def app
    render layout: 'iframe'

  end
  private

  def layout_name
      if params[:layout] == 0
          false
      else
          'application'
      end
  end


end
