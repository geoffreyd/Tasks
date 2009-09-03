config :'core-tasks', :required => [:sproutcore]
config :tasks,
  :required => [:'core-tasks', :sproutcore],
  :index_at => ''

proxy '/tasks-server', :to => 'localhost:8088', :protocol => 'http'
