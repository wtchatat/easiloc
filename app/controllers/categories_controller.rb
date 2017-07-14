class CategoriesController < ApplicationController
  before_action :set_category, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @categories = Categorie.all
    respond_with(@categories)
  end

  def show
    respond_with(@category)
  end

  def new
    @category = Categorie.new
    respond_with(@category)
  end

  def edit
  end

  def create
    @category = Categorie.new(categorie_params)
    @category.save
    respond_with(@category)
  end

  def update
    @category.update(categorie_params)
    respond_with(@category)
  end

  def destroy
    @category.destroy
    respond_with(@category)
  end

  private
    def set_category
      @category = Categorie.find(params[:id])
    end

    def category_params
      params.require(:category).permit(:name, :description, :type_id)
    end
end
