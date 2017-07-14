json.array! @routes do |route|
json.extract! route, :id, :user_id, :url , :routes , :alternative
end
