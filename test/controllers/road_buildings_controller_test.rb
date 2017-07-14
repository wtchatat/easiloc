require 'test_helper'

class RoadBuildingsControllerTest < ActionController::TestCase
  setup do
    @road_building = road_buildings(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:road_buildings)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create road_building" do
    assert_difference('RoadBuilding.count') do
      post :create, road_building: { building_id: @road_building.building_id, position: @road_building.position, road_id: @road_building.road_id }
    end

    assert_redirected_to road_building_path(assigns(:road_building))
  end

  test "should show road_building" do
    get :show, id: @road_building
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @road_building
    assert_response :success
  end

  test "should update road_building" do
    patch :update, id: @road_building, road_building: { building_id: @road_building.building_id, position: @road_building.position, road_id: @road_building.road_id }
    assert_redirected_to road_building_path(assigns(:road_building))
  end

  test "should destroy road_building" do
    assert_difference('RoadBuilding.count', -1) do
      delete :destroy, id: @road_building
    end

    assert_redirected_to road_buildings_path
  end
end
