backend sproutcore {
  .host = "localhost";
  .port = "4020";
}

backend persevere {
  .host = "localhost";
  .port = "8088";
}

sub vcl_recv {
  if (req.url ~ "^/$") {
    unset req.http.cookie;
    set req.backend = sproutcore;
  }
  else if (req.url ~ "^/tasks$") {
    error 750 "Moved Temporarily";
  }
  else if (req.url ~ "^/static") {
    unset req.http.cookie;
    set req.backend = sproutcore;
    
    /* always try and get cached /static assets*/
    lookup;
  }
  else if (req.url ~ "^/tasks-server") {
    set req.backend = persevere;
  }
}

sub vcl_miss {
  if (req.url ~ "^/$") {
    set bereq.url = "/tasks";
  }
}

sub vcl_fetch {
  if (req.url ~ "^/$") {
    unset obj.http.set-cookie;
  }
  
  if (obj.cacheable || req.url ~ "^/$" || req.url ~ "^/tasks$") {
    set obj.cacheable = true;
    
    /* Remove Expires from backend, it's not long enough */
    unset obj.http.expires;
    
    /* Set the clients TTL on this object */
    set obj.http.cache-control = "max-age = 60";
    
    /* Set how long Varnish will keep it */
    set obj.ttl = 1w;
    
    /* marker for vcl_deliver to reset Age: */
    set obj.http.magicmarker = "1";
  }
  
  if (req.url ~ "^/static") {
    unset obj.http.set-cookie;
    
    set obj.cacheable = true;
    
    /* Remove Expires from backend, it's not long enough */
    unset obj.http.expires;
    
    /* Set the clients TTL on this object */
    set obj.http.cache-control = "max-age = 10000";
    
    /* Set how long Varnish will keep it */
    set obj.ttl = 365d;
    
    /* marker for vcl_deliver to reset Age: */
    set obj.http.magicmarker = "1";
  }
}

sub vcl_deliver {
  if (resp.http.magicmarker) {
    /* Remove the magic marker */
    unset resp.http.magicmarker;
  
    /* By definition we have a fresh object */
    set resp.http.age = "0";
  }
  
  if (obj.hits > 0) {
    set resp.http.X-Cache = "HIT";
  } else {
    set resp.http.X-Cache = "MISS";
  }
}

sub vcl_error {
  if (obj.status == 750) {
      set obj.http.Location = "http://tasks.sproutcore.com/";
      set obj.status = 302;
      deliver;
  }
}