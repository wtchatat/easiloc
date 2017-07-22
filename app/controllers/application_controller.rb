class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

#  bloque cette ce filter on utilise pas la confirmation par mail
#  before_filter :ensure_signup_complete, only: [:new, :create, :update, :destroy]
before_filter :require_secret
#before_filter :configure_permitted_parameters, if: :devise_controller?

  protected
  #help dividing place in zone
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

  def configure_permitted_parameters


    devise_parameter_sanitizer.for(:sign_up) { |u| u.permit(:username, :email, :password,
      :password_confirmation, :remember_me, :avatar, :avatar_cache) }
    devise_parameter_sanitizer.for(:account_update) { |u| u.permit(:username, :email, :password,
      :password_confirmation, :current_password, :avatar, :avatar_cache) }
  end

  def ensure_signup_complete
   # Ensure we don't go into an infinite loop
   return if action_name == 'finish_signup'

   # Redirect to the 'finish_signup' page if the user
   # email hasn't been verified yet

       if current_user && true #!current_user.email_verified?

          #redirect_to finish_signup_path(current_user)
          redirect_to signed_in_root_path(current_user)
       end
   end



   def require_secret
     return if action_name == "landing"
      redirect_to("/") and return unless params[:secret] == '78hor0924wi84'
 end

end
