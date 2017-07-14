
require "json"

file_name = "C:/Users/EDC/railsApp/wawa/db/cameroon_regions.json"
unitead = JSON.parse(File.read(file_name))

def get_nodes data
  nodes = {}
  data.each do |x|
       next unless x["type"] == "node"
       x["points"] = [x["lat"],x["lon"]].to_json
       nodes[x["id"]] = x
    end
 return nodes;
end

def get_ways data
    ways = {}
    selected_nodes = get_nodes data
    data.each do |x|
         next unless x["type"] == "way"
         x["nodes"].each_with_index{|n,i| x["nodes"][i] = selected_nodes[n]["points"] }
         ways[x["id"]] = x
      end
    return ways;
end

def get_relations data
  relations = {}
  selected_nodes = get_nodes data
  selected_ways = get_ways data
  data.each do |x|
       next unless x["type"] == "relation"
       member_nodes = []
       member_ways =[]
       x["members"].each do |n|
         if n["type"] == "way"
          member_ways.push(selected_ways[n["ref"]]["nodes"])
          #member_ways.push(n["ref"])
         end
         if n["type"] == "node"
          member_nodes.push(selected_nodes[n["ref"]]["points"])
          #member_nodes.push(n["ref"])
        end
      end
      relations[x["id"]] = {}
      relations[x["id"]]["tags"] = x["tags"]
      relations[x["id"]]["member_nodes"] = member_nodes
      relations[x["id"]]["member_ways"] = member_ways
    end
  return relations;
end

def get_links data
relations = get_relations data
   relations.each do |k,v|
     cog = v["tags"].fetch("ref:COG","")
     level = v["tags"].fetch("admin_level","")
     #tags = "#{v['tags'].fetch('name','')},#{v['tags'].fetch('name:fr','')},#{v['tags'].fetch('name:en','')}"
     tags = v["tags"]
   relation = Admin.new(
        {
          :rid => k,
          :level => level,
          :cog => cog ,
          :tags => tags ,
          :member_nodes => v["member_nodes"].to_json,
         :member_ways => v["member_ways"].to_json
           })
    relation.save!
   end
  relations
end

get_links unitead["elements"]
#node = get_ways unitead["elements"]
#puts node.first[1]["nodes"].first
