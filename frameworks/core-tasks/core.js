/**
 * The core object of the Tasks framework.
 *
 * @author Sean Eidemiller
 */
/*globals CoreTasks */
 
CoreTasks = SC.Object.create({

  // The main data store.
  store: SC.Store.create(),

  // The resource path format for the remote server.
  _resourcePathFormat: 'tasks-server/%@%@%@',

  /*
   * The various modes of operation.
   *
   * OFFLINE_MODE: Entities are retrieved from and persisted to internal fixtures.
   * ONLINE_MODE: Entities are retrieved from and persisted to an actual, external server.
   */
  OFFLINE_MODE: 0,
  ONLINE_MODE: 1,

  // The current mode of operation.
  // TODO: [SE] set Tasks application mode via URL.
  mode: null,

  // The logged in user.
  user: null,

  // The login time of current user.
  loginTime: null,

  /**
   * A special 'allTasks' project where all tasks for all projects are grouped.
   *
   * This project exists outside of the store because we don't want it to be persisted.
   */
  allTasks: null,

  /**
   * A special 'unallocatedTasks' project where all unallocated tasks are grouped.
   *
   * This project exists outside of the store because we don't want it to be persisted.
   */
  unallocatedTasks: null,

  /**
   * A read-only computed property that returns a sorted list of all projects.
   */
  sortedProjects: function() {
    var unsorted = this.get('store').findAll(CoreTasks.Project);

    return unsorted.sort(function(a, b) {
      var ai = a.get('orderIndex');
      var bi = b.get('orderIndex');
      return ai - bi;
    }); 

  }.property(),

  /**
   * Creates a new record in the store.
   *
   * @param {CoreTasks.Record} recordType The type of the record.
   * @param {Hash} dataHash An optional data hash to seed the new record.
   */
  createRecord: function(recordType, dataHash) {
    // Check to see if the record defines a createRecord function (if it does, call it).
    if (recordType.createRecord) {
      return recordType.createRecord(recordType, dataHash);
    } else {
      // Otherwise, call createRecord on the store.
      return this.get('store').createRecord(recordType, (dataHash ? dataHash : {}));
    }
  },

  /**
   * Computes the full path component of the URL given a resource name and an optional ID.
   *
   * @param {String} resourceName The name of the resource (ex. 'project').
   * @param {String} id The ID of the entity (optional).
   * @param {Hash} queryParams Query parameters to append (optional).
   *
   * @returns {String} The full path component of the URL.
   */
  getFullResourcePath: function(resourceName, id, queryParams) {
    var params = '';
    id = id ? '/' + id : '';

    if (queryParams) {
      var i = 0;

      for (var key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          params += '%@%@=%@'.fmt(i === 0 ? '?' : '&', key, queryParams[key]);
          i++;
        }
      }
    }

    return this._resourcePathFormat.fmt(resourceName, id, params);
  },

  /**
   * Get user record corresponding to specified loginName.
   *
   * @param {String} user's login name.
   * @returns {Object} user record, if macthing one exists, or null.
   */
  getUser: function(loginName) {
    var users = CoreTasks.get('store').findAll(SC.Query.create({
      recordType: CoreTasks.User, 
      conditions: 'loginName = %@',
      parameters: [loginName]
    }));
    if(!users) return null;
    return users.objectAt(0);
  },

  /**
   * Check project of a given name.
   *
   * @param {String} project name.
   * @returns {Object) return project of given name if it exists, null otherwise.
   */
  getProject: function(projectName) {
    var projects = CoreTasks.get('store').findAll(SC.Query.create({
      recordType: CoreTasks.Project, 
      conditions: 'name = %@',
      parameters: [projectName]
    }));
    if(!projects) return null;
    return projects.objectAt(0);
  },

  /**
   * Generate unique ID for store record creation.
   *
   * @param (String) name of unimmplemented function
   */
  generateId: function() {
    return -(this._nextId++);
  },
  _nextId: 0

});

// Add the bind() function to the Function prototype.
SC.mixin(Function.prototype, {

  /**
   * This bind method was ported from the prototype for use in the AJAX callbacks.
   *
   *  Function#bind(object[, args...]) -> Function
   *  - object (Object): The object to bind to.
   *
   *  Wraps the function in another, locking its execution scope to an object
   *  specified by `object`.
   */
  bind: function (context) {
    var slice = Array.prototype.slice;

    var update = function(array, args) {
      var arrayLength = array.length, length = args.length;
      while (length--) array[arrayLength + length] = args[length];
      return array;
    };

    var merge = function(array, args) {
      array = slice.call(array, 0);
      return update(array, args);
    };

    if (arguments.length < 2 && SC.none(arguments[0])) return this;
    var __method = this, args = slice.call(arguments, 1);

    return function() {
      var a = merge(args, arguments);
      // var a = args.concat(arguments);
      return __method.apply(context, a);
    };
  }
    
});

// Set the mode of operation.
//CoreTasks.set('mode', CoreTasks.get('OFFLINE_MODE'));
CoreTasks.set('mode', CoreTasks.get('ONLINE_MODE'));
