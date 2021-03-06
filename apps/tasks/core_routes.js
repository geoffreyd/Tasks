// ==========================================================================
// Tasks Routes:
// Contains handlers for special URL routing
// ==========================================================================
/*globals Tasks CoreTasks sc_require */

sc_require('core');

/** @mixin
    @extends Tasks
    @author Jonathan Lewis
    @author Suvajit Gupta
  
  This mixin handles all the routing for Tasks.  Routes parse custom URL parameters
  to go straight to particular sections of the application.  They support bookmarking and
  browser history.
      
*/
Tasks.mixin( /** @scope Tasks */ {
  
  defaultProjectID: null,
  defaultProject: null,

  registerRoutes: function() {
    SC.routes.add('help', Tasks, 'helpRoute');
    SC.routes.add('view', Tasks, 'viewRoute');
    SC.routes.add('select', Tasks, 'selectRoute');
    SC.routes.add(':', Tasks, 'defaultRoute'); // the catch-all case that happens if nothing else matches
  },

  /**
    Show online help skipping authentication
    
    Format:
      'http://[host]/tasks#help' would show online help without requiring user authentication.
    
  */
  helpRoute: function(params) {
    Tasks._closeMainPage();
    Tasks.getPath('helpPage.mainPane').append();
  },
  
  /**
    View all tasks that match selection criteria after automatically logging in
    
    Example:
      'http://[host]/tasks#view&search=#321' would log in as 'guest' user and set search filter to '#321'.
    
  */
  viewRoute: function(params) {
    // console.log('DEBUG: viewRoute() search=' + params.search);
    Tasks._closeMainPage();
    if(!SC.none(params.search) && params.search !== '') {
      Tasks.assignmentsController.set('searchFilter', params.search);
    }
    // Enter the statechart.
    Tasks.goState('a', 1);
    Tasks.authenticate('guest', '');
  },
  
  /**
    Close main page if already logged in
  */
  _closeMainPage: function() {
    if(CoreTasks.get('currentUser')) { // logged in, so close
      var mainPage = Tasks.getPath('mainPage.mainPane');
      if(mainPage) {
        mainPage.remove();
      }
    }
  },
  
  /**
    At startup, select specified project and/or set search filter criteria
    
    Example:
      'http://[host]/tasks#select&projectId=#354&display=tasks&filter=unfinished&search=[SG]' would select project with ID #354 (if it exists) upon startup and show unfinished tasks assigned to SG.
    
    Legal values of filter are: showstoppers, troubled, unfinished, unvalidated, and completed
    
  */
  selectRoute: function(params) {
    // console.log('DEBUG: selectRoute() loginTime=' + CoreTasks.loginTime + ', projectId=' + params.projectId + ', display=' + params.display + ', filter=' + params.filter + ', search=' + params.search);
    if(!SC.none(params.display) && params.display !== '') {
      params.display = params.display.toLowerCase();
      switch(params.display) {
        case 'team': Tasks.assignmentsController.set('displayMode', Tasks.DISPLAY_MODE_TEAM); break;
        case 'tasks': Tasks.assignmentsController.set('displayMode', Tasks.DISPLAY_MODE_TASKS); break;
        default: console.warn('Illegal URL route value for display: ' + params.display);
      }
    }
    if(!SC.none(params.filter) && params.filter !== '') {
      params.filter = params.filter.toLowerCase();
      switch(params.filter) {
        case 'showstoppers': Tasks.assignmentsController.setAttributeFilterShowstoppers(); break;
        case 'troubled': Tasks.assignmentsController.setAttributeFilterTroubled(); break;
        case 'unfinished': Tasks.assignmentsController.setAttributeFilterUnfinished(); break;
        case 'unvalidated': Tasks.assignmentsController.setAttributeFilterUnvalidated(); break;
        case 'completed': Tasks.assignmentsController.setAttributeFilterCompleted(); break;
        default: console.warn('Illegal URL route value for filter: ' + params.filter);
      }
    }
    if(!SC.none(params.search) && params.search !== '') {
      Tasks.assignmentsController.set('searchFilter', params.search);
    }
    var defaultProjectId = null;
    if(!SC.none(params.projectId) && params.projectId !== '') {
      defaultProjectId = params.projectId.replace('#', '');
    }
    if(CoreTasks.loginTime) {
      if(defaultProjectId) Tasks.set('defaultProjectId', defaultProjectId);
      Tasks.defaultRoute();
    }
    else if(defaultProjectId) {
      var project = CoreTasks.getProjectById(defaultProjectId); // see if such a project exists
      if(!project) {
        console.warn('No project of ID #' + defaultProjectId);
        project = CoreTasks.get('allTasksProject');
      }
      if(project !== this.get('defaultProject')) {
        this.set('defaultProject', project);
        var selectedProject = Tasks.projectsController.getPath('selection.firstObject');
        if(project !== selectedProject) this.projectsController.selectObject(project);
      }
    }
  },
  
  /**
    The catch-all case when no routes are specified
  */
  defaultRoute: function(params) {
    if(CoreTasks.loginTime && SC.none(Tasks.state.a)) {
      // Enter the statechart.
      Tasks.goState('a', 1);
      Tasks.loginController.openPanel();
    }
  }
  
});
