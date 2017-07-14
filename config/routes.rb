Rails.application.routes.draw do

  resources :road_buildings

  resources :streets

  resources :categories

  resources :types

  resources :cities



  resources :road_buildings
  resources :annonces

  get 'home/index'
  get 'home/app'
  get 'home/place'

  #get "users/auth/:action/callback" => "contacts#:action"


  get 'locations/search' => "locations#place_search"
  post 'locations/landing' => "locations#landing"
  post 'locations/search' => "locations#search"
  post 'locations/set_user_favorite_route' => "locations#set_user_favorite_route"
  post 'locations/set_user_favorite_location' => "locations#set_user_favorite_location"
  post 'locations/route_partage' => "locations#route_partage"
  post 'locations/location_partage' => "locations#location_partage"
  get 'locations/search' => "locations#search"
  get 'locations/get_user_routes' => "locations#get_user_routes"
  post 'locations/save_user_route' => "locations#save_user_route"
  post 'locations/save_location' => "locations#save_location"
  get  'locations/getadmin' => "locations#getadmin"
  get  'locations/place' => "locations#place"
  get 'locations/user_locations' => "locations#user_locations"

  get 'locations/get_user_favorite_locations' => "locations#get_user_favorite_locations"
  get 'locations/get_user_suivi_locations' => "locations#get_user_suivi_locations"
  get 'locations/get_user_favorite_routes' => "locations#get_user_favorite_routes"
  get 'locations/get_user_partage_routes' => "locations#get_user_partage_routes"

  post 'locations/filter' => "locations#filter"
  get 'locations/get_user/:id' => "locations#get_user"
  get 'locations/favorite_route' => "locations#favorite_route"
  post 'locations/set_user' => "locations#set_user"
  get 'locations/partage/:id' => "locations#partage"
  get 'locations/user/:id' => "locations#user"
  get 'users/active_user' => "users#active_user"
  resources :locations

  devise_for :users, :controllers => { omniauth_callbacks: 'omniauth_callbacks' }
  match '/users/:id/finish_signup' => 'users#finish_signup', via: [:get, :patch], :as => :finish_signup
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  devise_scope :user do
    authenticated :user do
      root 'home#index', as: :authenticated_root
    end

    unauthenticated do
      # doit retirer pour permettre les inscription
      #root 'devise/sessions#new', as: :unauthenticated_root
      root 'home#landing', as: :unauthenticated_root
    end
  end


  #get "*path.html" => "application#index", :layout => 0
  #get "*path" => "application#index"

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
