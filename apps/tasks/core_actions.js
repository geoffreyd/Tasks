/**
 * A mixin that defines all of the "actions" that trigger state transitions.
 *
 * @author Sean Eidemiller
 * @author Suvajit GÏupta
 * License: Licened under MIT license (see license.js)
 */
/*globals CoreTasks Tasks sc_require */
sc_require('core');

// FIXME: [SC] shouldn't have to manually add/remove to/from controller instead of store notifying of changes.
// FIXME: [SC] shouldn't have to call Store.commitRecords() after createRecord for Fixtures Data Source.

Tasks.mixin({
  
  loginName: null,
  _usersLoaded: false,

  /**
   * Authenticate user trying to log in to Tasks application.
   *
   * @param {String} user's login name.
   * @param {String} user's password.
   */
  authenticate: function(loginName, password) { 
    console.log("authenticate: "+this.state.a) ;
    switch (this.state.a) {
      case 1:
        this.goState('a', 2);
        this.loginName = loginName;
        
        if(this._usersLoaded) {
          this._loginUser();
        }
        else {
          // Retrieve all users from the data source.
          CoreTasks.get('store').find(
            SC.Query.local(CoreTasks.User,undefined,{
              successCallback: this._usersLoadSuccess.bind(this),
              failureCallback: this._usersLoadFailure.bind(this)
            }
          ));
        }
        break;

      default:
        this._logActionNotHandled('authenticate', 'a', this.state.a);  
    }
  },

  /**
   * Called after all users have been loaded from the data source.
   *
   * Now we can "authenticate" the user by searching for a matching loginName attribute in the list
   * of users in the store.
   */
  _usersLoadSuccess: function(storeKeys) {
    console.log('_usersLoadSuccess');
    
    this._usersLoaded = true;
    var serverMessage = Tasks.getPath('mainPage.mainPane.serverMessage');
    serverMessage.set('value', serverMessage.get('value') + "_UsersLoaded".loc());
    
    // Load all users into the usersController
    var store = CoreTasks.get('store');
    // var users = store.recordArrayFromStoreKeys(storeKeys, CoreTasks.User, store);
    var users = store.find(CoreTasks.User);
    this.get('usersController').set('content', users);
    
    this._loginUser();
    
  },

  /**
   * Called if the request to the data source to load all users failed for some reason.
   */
  _usersLoadFailure: function() { 
    console.log("_usersLoadFailure") ;
    Tasks.loginController.closePanel();
    this.goState('a', 1);
    alert('System Error: Unable to retrieve users from server');
  },

  /**
   * Called to login user.
   */
  _loginUser: function() {
    console.log("_loginUser");
    var user = CoreTasks.getUser(this.loginName);
    if (user) { // See if a valid user
      
      // Welcome use and save login session information
      CoreTasks.set('user', user);
      var welcomeMessage = Tasks.getPath('mainPage.mainPane.welcomeMessage');
      welcomeMessage.set('value', "_Welcome".loc() + CoreTasks.getPath('user.name').toUpperCase());
      welcomeMessage.set('toolTip', "_LoginSince".loc() + new Date().format('hh:mm:ss a MMM dd, yyyy'));
      
      // Based on user's rolem set up appropriate task filter
      if(user.get('role') === CoreTasks.USER_ROLE_DEVELOPER) {
        Tasks.assignmentsController.set('assigneeSelection', this.loginName);
      }
      this._authenticationSuccess();
      
    } else {
      this._authenticationFailure();
    }
    
  },

  /**
   * Called after successful login.
   */
  _authenticationSuccess: function() { 
    console.log("_authenticationSuccess") ;
    
    switch (this.state.a) {
      case 2:
        this.goState('a', 3);
        Tasks.loginController.closePanel();
        // Load all data (projects and tasks) from the data source.
        this._loadData();
        break;

      default:
        this._logActionNotHandled('_authenticationSuccess', 'a', this.state.a);  
    }
    
  },

  /**
   * Called after failed login.
   */
  _authenticationFailure: function() { 
    console.log("_authenticationFailure") ;
    switch (this.state.a) {
      case 2:
        Tasks.loginController.displayLoginError();
        this.goState('a', 1);
        break;
      default:
        this._logActionNotHandled('_authenticationFailure', 'a', this.state.a);  
    }
  },
  
  /**
   * Load all data (projects and tasks) used by Tasks views.
   */
  _loadData: function() { 
    console.log("_loadData") ;

    // Start by loading all tasks.
    CoreTasks.get('store').find( SC.Query.local(
      CoreTasks.Task, undefined, {
      successCallback: this._tasksLoadSuccess.bind(this),
      failureCallback: this._dataLoadFailure.bind(this)
    }));
    
  },

  /**
   * Called after all tasks have been loaded from the data source.
   */
  _tasksLoadSuccess: function() { 
    console.log("_tasksLoadSuccess") ;

    var serverMessage = Tasks.getPath('mainPage.mainPane.serverMessage');
    serverMessage.set('value', serverMessage.get('value') + "_TasksLoaded".loc());

    // Now load all of the projects.
    CoreTasks.get('store').find(SC.Query.local(
      CoreTasks.Project, undefined, {
      successCallback: this._projectsLoadSuccess.bind(this),
      failureCallback: this._dataLoadFailure.bind(this)
    }));
    
  },

  /**
   * Called after all projects have been loaded from the data source.
   */
  _projectsLoadSuccess: function(storeKeys) { 
    console.log("_projectsLoadSuccess") ;

    var serverMessage = Tasks.getPath('mainPage.mainPane.serverMessage');
    serverMessage.set('value', serverMessage.get('value') + "_ProjectsLoaded".loc());

    var store = CoreTasks.get('store');
    // var projects = store.recordArrayFromStoreKeys(storeKeys, CoreTasks.Project, store);
    var projects = store.find(SC.Query.local(CoreTasks.Project, 'system=NO'));
    
    // Get all tasks from the store and push them into the unallocated array.
    var tasks = store.find(CoreTasks.Task);
    var taskCount = tasks.get('length');
    var all = [];
    var unallocated = [];
    var unallocatedIds = [];

    for (var i = 0; i < taskCount; i++) {
      var task = tasks.objectAt(i);
      all.push(task);
      unallocated.push(task);
      unallocatedIds.push(task.get('id'));
    }

    // Create the AllTasks project to hold all tasks in the system.
    var allTasksProject = store.createRecord(CoreTasks.Project, {
      name: CoreTasks.ALL_TASKS_NAME.loc(),
      system: YES
    });

    allTasksProject.set('tasks', all);
    CoreTasks.set('allTasks', allTasksProject);

    // Find tasks that belong to projects and remove from unallocated array.
    var projectCount = projects.get('length');

    for (i = 0; i < projectCount; i++) {
      var project = projects.objectAt(i);
      tasks = project.get('tasks');
      taskCount = tasks.get('length');
      for (var j = 0; j < taskCount; j++) {
        var idx = unallocatedIds.indexOf(tasks.objectAt(j).get('id'));

        // Remove task and task ID from corresponding arrays.
        unallocated.splice(idx, 1);
        unallocatedIds.splice(idx, 1);
      }
    }

    // Create the UnallocatedTasks project with the unallocated tasks.
    var unallocatedTasksProject = CoreTasks.createRecord(CoreTasks.Project, {
      id: 0,
      name: CoreTasks.UNALLOCATED_TASKS_NAME.loc(),
      system: YES
    });

    unallocatedTasksProject.set('tasks', unallocated);
    CoreTasks.set('unallocatedTasks', unallocatedTasksProject);

    // Add AllTasks and UnallocatedTasks projects to the top of the list of projects
    // console.log("about to unshift on projects");
    // projects.unshiftObject(unallocatedTasksProject);
    // projects.unshiftObject(allTasksProject);
    // console.log("just unshifted on projects");

    // Set the contnent of the projects controller.
    this.get('projectsController').set('content', projects);

    this._dataLoadSuccess();
  },

  /**
   * Called after successful data load.
   */
  _dataLoadSuccess: function() { 
    console.log("_dataLoadSuccess") ;
    switch (this.state.a) {
      case 3:
        this.goState('a', 4);
        break;
      default:
        this._logActionNotHandled('dataLoadSuccess', 'a', this.state.a);  
    }
  },
  
  /**
   * Called after failed data load.
   */
  _dataLoadFailure: function() { 
    console.log("_dataLoadFailure") ;
    switch (this.state.a) {
      case 3:
        alert('System Error: Unable to retrieve project/task data from server');
        break;
      default:
        this._logActionNotHandled('dataLoadSuccess', 'a', this.state.a);  
    }
  },
  
  /**
   * Save modified data to persistent store.
   */
  saveData: function() { 
    console.log("saveData") ;
    var store = CoreTasks.get('store');

    // Remove the store keys of the AllTasks & UnallocatedTasks projects from the changelog so that they're not
    // persisted to the server.
    var allTasksKey = CoreTasks.getPath('allTasks.storeKey');
    var unallocatedTasksKey = CoreTasks.getPath('unallocatedTasks.storeKey');
    var cl = store.changelog;
    if (cl) {
      if (cl.contains(allTasksKey)) cl.remove(allTasksKey);
      if (cl.contains(unallocatedTasksKey)) cl.remove(unallocatedTasksKey);
    }

    // Now commit all dirty records to the database.
    store.commitRecords();
    var serverMessage = Tasks.getPath('mainPage.mainPane.serverMessage');
    serverMessage.set('value', "_SaveMessage".loc() + new Date().format('hh:mm:ss a'));
    
  },
  
  /**
   * Import data from external text file.
   */
  importData: function() { 
    console.log("importData") ;
    Tasks.importDataController.openPanel();  
  },

  /**
   * Export data to external text file.
   */
  exportData: function() { 
    console.log("exportData") ;
    Tasks.exportDataController.openPanel();  
  },
  
  /**
   * Launch new browser/tab to display online help.
   */
   /**
    * Launch task editor dialog.
    */
  settings: function() { 
    console.log("settings") ;
   Tasks.settingsController.openPanel();
  },

  help: function() { 
    console.log("help") ;
    Tasks.helpController.openPanel();
  },
  
  /**
   * Handle application exiting request.
   */
  logout: function() { 
    console.log("logout") ;
    if(confirm("_LogoutConfirmation".loc())) {
      Tasks.getPath('mainPage.mainPane.welcomeMessage').set('value', null);
      this._usersLoaded = false;
      this.get('projectsController').set('content', null);
      CoreTasks.store.reset();
      this.goState('a', 1);
    }
  },
  
  /**
   * Save all changes before exiting application.
   */
  saveAndExit: function() { 
    console.log("saveAndExit") ;
    // TODO: [SG] implement save & exit
    this._notImplemented('saveAndExit');
  },
  
  /**
   * Exit application without saving changes.
   */
  exitNoSave: function() { 
    console.log("exitNoSave") ;
    // TODO: [SG] implement exit w/o save
    this._notImplemented('exitNoSave');
  },
  
  /**
   * Add a new project and start editing it in projects master list.
   */
  addProject: function() { 
    console.log("addProject") ;
    var project = CoreTasks.get('store').createRecord(
      CoreTasks.Project, { name: CoreTasks.NEW_PROJECT_NAME.loc() } );
    // FIXME: [SC] must set tasks array to empty because for some reason it is not defaulting it to empty.
    project.set('tasks', []);
    this.getPath('projectsController.content').pushObject(project);

    var listView = Tasks.getPath('mainPage.mainPane.projectsList');
    var idx = listView.length - 1;
    listView.select(idx);

    // Begin editing newly created item.
    var itemView = listView.itemViewForContentIndex(idx);
    
    // Wait for run loop to complete before method is called.
    CoreTasks.invokeLater(itemView.beginEditing.bind(itemView));
  },
  
  /**
   * Delete selected project in master projects list.
   *
   @returns {Boolean} YES if the deletion was a success.
   */
  deleteProject: function() { 
    console.log("deleteProject") ;
    
    // Get the selected project.
    var pc = this.get('projectsController');
    var sel = pc.get('selection');
    
    if (sel && sel.length() > 0) {
      var project = sel.firstObject();

      // Confirm deletion for projects that have tasks
      var projectTasks = project.get('tasks');
      var taskCount = projectTasks.get('length');
      if(taskCount > 0) {
        if(!confirm("_ConfirmProjectDeletion".loc())) return NO;
      }

      // Move all tasks in project to UnallocatedTasks project since they are now orphaned
      var unallocatedTasksProject = CoreTasks.get('unallocatedTasks');
      for (var i = 0; i < taskCount; i++) {
        var task = projectTasks.objectAt(i);
        unallocatedTasksProject.addTask(task);
      }

      // Remove the project from the list and destroy.
      pc.removeObject(project);
      project.destroy();
      
      // Select the first project in the list.
      // FIXME: [SC] Do this without using SC.RunLoop.begin/end, if possible.
      SC.RunLoop.begin();
      var projectsList = Tasks.getPath('mainPage.mainPane.projectsList');
      projectsList.select(projectsList.get('length') > 2? 2 : 0);
      SC.RunLoop.end();
      
    }
    return YES;
  },
  
  /**
   * Add a new task to tasks detail list.
   */
  addTask: function() { 
    console.log("addTask") ;
    
    var user = CoreTasks.getPath('user.id');
    var taskHash = SC.merge({ 'submitter': user, 'assignee': user }, CoreTasks.Task.NEW_TASK_HASH);
    taskHash.name = CoreTasks.NEW_TASK_NAME.loc();
    var searchFilter = Tasks.assignmentsController.get('searchFilter');
    if (searchFilter) taskHash.name = searchFilter + ' ' + taskHash.name;
    var task = CoreTasks.createRecord(CoreTasks.Task, taskHash);
    // task.id = CoreTasks.generateId(); // For FIXTUREs

    // Get selected task and get its assignee so that we can set the same assignee on the
    // newly-created task.
    var tc = this.get('tasksController');
    var sel = tc.get('selection');

    if (sel && sel.length() > 0) { // Copy some attributes of selected task to new task
      var selectedObject = sel.firstObject();
      if (SC.instanceOf(selectedObject, CoreTasks.Task)) {
        var taskAssignee = selectedObject.get('assignee');
        if(taskAssignee) task.set('assignee', taskAssignee);
        task.set('type', selectedObject.get('type'));
        task.set('priority', selectedObject.get('priority'));
        task.set('status', selectedObject.get('status'));
        task.set('validation', selectedObject.get('validation'));
      }
    }

    // We have to commit the task immediately because we need the ID before we add the task to the
    // selected project.
    var params = {
      successCallback: this._addTaskSuccess.bind(this),
      failureCallback: this._addTaskFailure.bind(this)
    };

    task.commitRecord(params);
  },

  _addTaskSuccess: function(storeKey) { 
    console.log("_addTaskSuccess") ;
    
    // Get the task object from the store.
    var task = CoreTasks.get('store').materializeRecord(storeKey);

    // Add the new task to the currently-selected project.
    var project = this.getPath('projectsController.selection').firstObject();
    project.addTask(task);

    // Add the task to the All Tasks project.
    CoreTasks.get('allTasks').addTask(task);

    // Refresh the assignments controller.
    var ac = this.get('assignmentsController');
    CoreTasks.invokeLater(ac.showAssignments.bind(ac));
    
    // Select new task.
    Tasks.tasksController.selectObject(task);
    
    // Begin editing new task.
    var listView = Tasks.getPath('mainPage.mainPane.tasksList');
    var tasksList = listView.get('content');
    var idx = tasksList.indexOf(task);
    // FIXME: [SC] added the to make the TaskList scroll to the newly added item - there is a bug with SC.TextFieldView that will cause the textfield to follow your scroll if the TextField has the cursor (focus)
    listView.scrollToContentIndex(idx);
    var itemView = listView.itemViewForContentIndex(idx);
    itemView.beginEditing();
  },

  _addTaskFailure: function(storeKey) { 
    console.log("_addTaskFailure") ;
    // TODO: [SE] Implement addTaskFailure
  },
  
  /**
   * Delete selected task in tasks detail list.
   */
  deleteTask: function() { 
    console.log("deleteTask") ;
    
    var tc = this.get('tasksController');
    var sel = tc.get('selection');
    if (sel && sel.length() > 0) {
      var context = {};
      for (var i = 0; i < sel.length(); i++) {
        
        // Get the task and remove it from the project.
        var task = sel.nextObject(i, null, context);
        var project = this.getPath('projectsController.selection').firstObject();
        project.removeTask(task);

        // Remove the task from the All Tasks project.
        CoreTasks.get('allTasks').removeTask(task);

        // Now remove the task from the assignments controller.
        tc.set('selection', null);
      
        var ac = this.get('assignmentsController');      
        ac.removeObject(task);

        // Finally, destroy the task.
        task.destroy();
      }

    }
  },
  
  // TODO: [SE] implement deleteTaskSuccess/Failure
  
  /**
   * Filter tasks via attributes.
   */
  filterTasks: function() { 
    console.log("filterTasks") ;
    Tasks.filterController.openPane();
  },

  /**
   * Add a new user.
   */
  addUser: function() { 
    console.log("addUser") ;
    var user = CoreTasks.get('store').createRecord(CoreTasks.User, SC.clone(CoreTasks.User.NEW_USER_HASH));
    this.getPath('usersController.content').pushObject(user);
    var listView = Tasks.getPath('settingsPage.panel.usersList');
    var idx = listView.length - 1;
    listView.scrollToContentIndex(idx); // FIXME: [SC] why is it not scrolling to new item?
    listView.select(idx);
  },

  /**
   * Delete selected user.
   */
  deleteUser: function() { 
    console.log("deleteUser") ;
  
    // Get the selected user.
    var uc = this.get('usersController');
    var sel = uc.get('selection');
  
    if (sel && sel.length() > 0) {
      var user = sel.firstObject();

      // Confirm deletion of user
      if(!confirm("Are you sure you want to delete this user?")) return;

      // Remove the user from the list and destroy.
      uc.removeObject(user);
      user.destroy();
    
      // Select the first user in the list.
      // FIXME: [SC] Do this without using SC.RunLoop.begin/end, if possible.
      SC.RunLoop.begin();
      var listView = Tasks.getPath('settingsPage.panel.usersList');
      listView.scrollToContentIndex(0);
      listView.select(0);
      SC.RunLoop.end();
    
    }
  },

  /**
   * Logs a message indicating that the given state isn't handled in the given action.
   *
   * @param {String} action The name of the action (ex. "logout").
   * @param {String} stateName The name of the state (ex. "a").
   * @param {Integer} stateNum The number of the sate (ex. "4").
   */
  _logActionNotHandled: function(action, stateName, stateNum) { 
    console.log("_logActionNotHandled") ;
    console.log('Error: action not handled in state %@[%@]: %@'.fmt(stateName, stateNum, action));
  },
  
  /**
   * Temporary callback to handle missing functionality.
   *
   * @param (String) name of unimmplemented function
   */
  _notImplemented: function(functionName) { 
    console.log("_notImplemented") ;
    var prefix = '';
    if(functionName) {
      prefix = functionName + '(): ';
    }
    alert (prefix + 'Not yet implemented');
  }  
  
});
