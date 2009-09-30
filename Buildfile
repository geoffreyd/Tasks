config :django, :required => [:sproutcore]
config :mypolls, :required => [:django]
config :'core-tasks', :required => [:sproutcore, :mypolls]
config :tasks, :required => [:'core-tasks', :sproutcore]

proxy '/tasks-server', :to => 'localhost:8088', :protocol => 'http'

proxy '/api', :to => "www.taijala.com", :url => '/api'