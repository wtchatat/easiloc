# config valid only for current version of Capistrano
lock "3.8.2"

set :application, "easiloc"
set :repo_url, "https://github.com/wtchatat/easiloc.git"



set :deploy_to, '/home/deploy/easiloc'

append :linked_files, "config/database.yml", "config/secrets.yml"
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "vendor/bundle", "public/system", "public/uploads"


# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5
