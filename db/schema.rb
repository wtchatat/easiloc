# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170712172546) do

  create_table "admins", force: true do |t|
    t.integer  "rid",          limit: 8
    t.integer  "level"
    t.string   "cog"
    t.text     "tags",         limit: 2147483647
    t.text     "member_nodes", limit: 2147483647
    t.text     "member_ways",  limit: 2147483647
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "annonces", force: true do |t|
    t.string   "categorie"
    t.string   "social"
    t.string   "type"
    t.string   "titre"
    t.string   "price"
    t.text     "description"
    t.integer  "adresse_id"
    t.integer  "zone_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "etat"
  end

  create_table "attaches", force: true do |t|
    t.string   "filename"
    t.string   "title"
    t.integer  "attachable_id"
    t.string   "attachable_type"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "buildings", force: true do |t|
    t.string   "tname"
    t.integer  "tid",        limit: 8
    t.string   "ttype"
    t.text     "ttext"
    t.text     "points",     limit: 16777215
    t.integer  "zone",       limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "tparent"
  end

  create_table "categories", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "type_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cities", force: true do |t|
    t.string   "tname"
    t.integer  "tid",        limit: 8
    t.string   "ttype"
    t.string   "tparent"
    t.text     "points",     limit: 16777215
    t.integer  "zone",       limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "ttext"
  end

  create_table "favourite_locations", force: true do |t|
    t.integer  "user_id"
    t.integer  "location_id"
    t.integer  "building_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "favourite_routes", force: true do |t|
    t.integer  "user_id"
    t.text     "url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "guest_locations", force: true do |t|
    t.string   "email"
    t.string   "name"
    t.integer  "user_id"
    t.text     "url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "guests", force: true do |t|
    t.string   "email"
    t.string   "name"
    t.integer  "user_id"
    t.text     "url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "identities", force: true do |t|
    t.integer  "user_id"
    t.string   "provider"
    t.string   "uid"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "access_token"
    t.string   "image"
  end

  add_index "identities", ["user_id"], name: "index_identities_on_user_id", using: :btree

  create_table "invites", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "locations", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.integer  "type_id"
    t.integer  "categorie_id"
    t.string   "lng"
    t.string   "lat"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "quartier"
    t.string   "arrondissement"
    t.string   "departement"
    t.string   "region"
    t.string   "rue"
    t.string   "building"
    t.integer  "on_map"
    t.text     "created_nodes"
    t.integer  "position"
    t.integer  "rang"
    t.integer  "user_id"
    t.string   "mairie"
    t.string   "nature"
    t.string   "guest"
  end

  create_table "members", force: true do |t|
    t.string   "mtype"
    t.integer  "ref",        limit: 8
    t.string   "role"
    t.integer  "rid",        limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "nds", force: true do |t|
    t.integer  "ref"
    t.integer  "way_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "nodes", force: true do |t|
    t.string   "lat"
    t.string   "lng"
    t.integer  "visible"
    t.date     "tstamp"
    t.integer  "nid",        limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "zone"
  end

  add_index "nodes", ["lat", "lng"], name: "index_nodes_on_lat_and_lng", using: :btree
  add_index "nodes", ["lng", "lat"], name: "index_nodes_on_lng_and_lat", using: :btree
  add_index "nodes", ["nid"], name: "index_nodes_on_nid", using: :btree

  create_table "noeuds", force: true do |t|
    t.string   "lat"
    t.string   "lng"
    t.date     "tstamp"
    t.integer  "nid",        limit: 8
    t.integer  "zone",       limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "noeuds", ["lat"], name: "index_noeuds_on_lat", using: :btree
  add_index "noeuds", ["zone"], name: "index_noeuds_on_zone", using: :btree

  create_table "places", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "rubrique"
    t.string   "place_type"
    t.string   "nature"
    t.integer  "auth_id"
    t.integer  "location_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "pois", force: true do |t|
    t.string   "tname"
    t.integer  "tid",        limit: 8
    t.string   "ttype"
    t.text     "ttext"
    t.text     "points",     limit: 16777215
    t.integer  "zone",       limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "tparent"
  end

  create_table "relations", force: true do |t|
    t.integer  "visible"
    t.date     "tstamp"
    t.integer  "rid"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "relations", ["rid"], name: "index_relations_on_rid", using: :btree

  create_table "road_buildings", force: true do |t|
    t.integer  "road_id"
    t.integer  "building_id"
    t.integer  "position"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "routes", force: true do |t|
    t.integer  "user_id"
    t.text     "routes",      limit: 2147483647
    t.text     "url"
    t.integer  "alternative"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "streets", force: true do |t|
    t.string   "tname"
    t.integer  "tid",        limit: 8
    t.text     "ttext"
    t.string   "ttype"
    t.string   "tparent"
    t.text     "points",     limit: 16777215
    t.integer  "zone",       limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "suivis_locations", force: true do |t|
    t.integer  "location_id"
    t.integer  "guest_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tag_pois", force: true do |t|
    t.string   "tname"
    t.integer  "tid",        limit: 8
    t.text     "ttext"
    t.string   "ttype"
    t.string   "tparent"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tags", force: true do |t|
    t.string   "tkey"
    t.string   "tvalue"
    t.string   "tname"
    t.integer  "tid",        limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "tags", ["tid"], name: "index_tags_on_tid", using: :btree

  create_table "types", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "name"
    t.string   "avatar"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "way_nodes", force: true do |t|
    t.integer  "wid",        limit: 8
    t.integer  "nid",        limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "way_nodes", ["nid", "wid"], name: "index_way_nodes_on_nid_and_wid", using: :btree
  add_index "way_nodes", ["wid", "nid"], name: "index_way_nodes_on_wid_and_nid", using: :btree

  create_table "ways", force: true do |t|
    t.integer  "visible"
    t.date     "tstamp"
    t.integer  "wid",        limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "nds",        limit: 2147483647
  end

  add_index "ways", ["wid"], name: "index_ways_on_wid", using: :btree

end
