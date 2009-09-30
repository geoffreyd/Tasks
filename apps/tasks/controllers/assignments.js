// ==========================================================================
// Project: Tasks 
// ==========================================================================
/*globals CoreTasks Tasks */

/** 

  This controller manages what is displayed in the Tasks detail screen.
  This is affected by the selected Project/User and the search criteria.
  
  @extends SC.ArrayController
  @author Joshua Holt
  @author Suvajit Gupta
*/

Tasks.attributeFilterAllEnabled = [
  CoreTasks.TASK_TYPE_FEATURE, CoreTasks.TASK_TYPE_BUG, CoreTasks.TASK_TYPE_OTHER,
  CoreTasks.TASK_PRIORITY_HIGH, CoreTasks.TASK_PRIORITY_MEDIUM, CoreTasks.TASK_PRIORITY_LOW,
  CoreTasks.TASK_STATUS_PLANNED, CoreTasks.TASK_STATUS_ACTIVE, CoreTasks.TASK_STATUS_DONE, CoreTasks.TASK_STATUS_RISKY,
  CoreTasks.TASK_VALIDATION_UNTESTED, CoreTasks.TASK_VALIDATION_PASSED, CoreTasks.TASK_VALIDATION_FAILED
];

Tasks.assignmentsController = SC.ArrayController.create(
/** @scope Tasks.assignmentsController.prototype */ {
  
  contentBinding: 'Tasks.projectController.tasks',
  assignedTasks: null,
  _timer: null,
  
  assigneeSelection: null,
  searchFilter: null,
  attributeFilterCriteria: Tasks.attributeFilterAllEnabled.slice(0),
  clearAttributeFilter: function() {
    this.set('attributeFilterCriteria', Tasks.attributeFilterAllEnabled.slice(0));
  },
  
  attributeFilter: function(name, value) {
    if (value !== undefined) {
      if(value) {
        if(this.attributeFilterCriteria.indexOf(name) === -1) {
          this.attributeFilterCriteria.push(name);
        }
      }
      else {
        var idx = this.attributeFilterCriteria.indexOf(name);
        if (idx !== -1) this.attributeFilterCriteria.splice(idx, 1);
      }
      return this;
    }
    else {
      return (this.attributeFilterCriteria.indexOf(name) !== -1);
    }
  },
  
  attributeFilterTypeFeature: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_TYPE_FEATURE, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterTypeBug: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_TYPE_BUG, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterTypeOther: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_TYPE_OTHER, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterPriorityHigh: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_PRIORITY_HIGH, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterPriorityMedium: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_PRIORITY_MEDIUM, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterPriorityLow: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_PRIORITY_LOW, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterStatusPlanned: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_STATUS_PLANNED, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterStatusActive: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_STATUS_ACTIVE, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterStatusDone: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_STATUS_DONE, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterStatusRisky: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_STATUS_RISKY, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterValidationUntested: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_VALIDATION_UNTESTED, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterValidationPassed: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_VALIDATION_PASSED, value);
  }.property('attributeFilterCriteria'),
  
  attributeFilterValidationFailed: function(key, value) {
    return this.attributeFilter(CoreTasks.TASK_VALIDATION_FAILED, value);
  }.property('attributeFilterCriteria'),
  
  
  attributeFilterIcon: function() {
    return this.attributeFilterCriteria.length === 13? 'filter-tasks-icon-no-criteria' : 'filter-tasks-icon-has-criteria';
  }.property('attributeFilterCriteria'),
  
  hasFiltering: function() {
    return this.assigneeSelection || this.searchFilter || this.attributeFilterCriteria.length !== 13;
  },
  
  
  // count: 0, // used for tracking/tuning calls to redraw tasks pane below
  showAssignments: function() { // show tasks for selected user that matches search filter
   
    console.log("DEBUG: showAssignments(" + this.count + ") entry at: " + new Date().format('hh:mm:ss a'));
    
    // Extract selected assignee users whose tasks are to be displayed
    var selectedAssigneeDisplayNames = [];
    var selectedAssignees = this.get('assigneeSelection');
    if (selectedAssignees) {
      var selectedAssigneeLoginNames = selectedAssignees.split(" ");
      for (var i = 0; i < selectedAssigneeLoginNames.length; i++) {
        var selectedAssigneeUser = CoreTasks.getUser(selectedAssigneeLoginNames[i]);
        if (selectedAssigneeUser) selectedAssigneeDisplayNames.push(selectedAssigneeUser.get('displayName'));
      }
    }
    
    // Extract task name search filter
    var sf = this.get('searchFilter');
    sf = this._escapeMetacharacters(sf);
    var rx = new RegExp(sf, 'i');
    
    // Get time left, if any specified, in selected project.
    var projectTimeLeft = null;
    var sel = Tasks.getPath('projectsController.selection');
    if (sel && sel.length() > 0) {
      var project = sel.firstObject();
      projectTimeLeft = project.get('timeLeft');
    }
      
    // Group tasks by user & separate unassigned tasks
    var assignees = {}, assigneeName, assignee, assignmentNodes = [];
    this.forEach( 
      function(task){ // FIXME: [SC] unclear why task is null at times
        if(!task) return; 
        assignee = task.get('assignee');
        if (assignee && !assignee.get) { // FIXME: [SC] unclear why assigneee.get() is null at times
          return;
        }
        assigneeName = assignee ? assignee.get('displayName') : CoreTasks.USER_UNASSIGNED;
        if(selectedAssigneeDisplayNames.length === 0 || selectedAssigneeDisplayNames.indexOf(assigneeName) !== -1) {
          var assigneeObj = assignees[assigneeName];
          if(!assigneeObj) {
            assigneeObj = { assignee: assignee, tasks: [] };
            assignees[assigneeName] = assigneeObj;
          }
          
          // Filter tasks that meet filter criteria
          var type = task.get('type');
          if(this.attributeFilterCriteria.indexOf(type) === -1) return;
          var priority = task.get('priority');
          if(this.attributeFilterCriteria.indexOf(priority) === -1) return;
          var status = task.get('status');
          if(this.attributeFilterCriteria.indexOf(status) === -1) return;
          var validation = task.get('validation');
          if(this.attributeFilterCriteria.indexOf(validation) === -1) return;
          if(!(task.get('name').match(rx) || ('' + task.get('id')).match(rx))) return;
          assigneeObj.tasks.push(task);
        }
      },
    this);
  
    for(assigneeName in assignees){
      if(assignees.hasOwnProperty(assigneeName)) {
          this._createAssignmentNode(assignmentNodes, assigneeName, assignees[assigneeName], projectTimeLeft);
      }
    }
      
    // Sort grouped tasks by assignee
    this.set('assignedTasks', SC.Object.create({ treeItemChildren: assignmentNodes.sort(function(a,b) {
      if (a.displayName===b.displayName) return 0;
      return (a.displayName > b.displayName) ? 1 : -1;
    }), treeItemIsExpanded: YES }));
    
    console.log("DEBUG: showAssignments(" + this.count++ + ") exit  at: " + new Date().format('hh:mm:ss a'));

  },
  
  _escapeMetacharacters: function(str){
    var metaCharacters = [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\' ];
    var s = new RegExp('(\\' + metaCharacters.join('|\\') + ')', 'g');
    return str? str.replace(s, '\\$1') : '';
  },
  
  /**
   * Create a node in the tree showing a user's tasks.
   *
   * @param {Array} set of assignment nodes.
   * @param {String} assignee name.
   * @param {Object} a hash of assignee ID and tasks array.
   * @param {Number} amount of time left in project.
   * @returns {Object) return a node to be inserted into the tree view.
   */
  _createAssignmentNode: function(assignmentNodes, assigneeName, assigneeObj, projectTimeLeft) {
    
    var taskWithUnspecifiedEffort = false;
    var displayName = assigneeName;
    var effortString, totalEffortMin = 0, totalEffortMax = 0, effortMin, effortMax;
    var task, tasks = assigneeObj.tasks;
    var len = tasks.get('length');
    if (len === 0) return; // nothing to do
    
    for (var i = 0; i < len; i++) {
      task = tasks.objectAt(i);
      
      // Add observers to certain task properties that can require the assignmentsController to redraw
      // FIXME: [SC] see why these are firing multiple times when only one property is changed
      task.removeObserver('assignee',Tasks.assignmentsController,'_contentHasChanged');
      task.removeObserver('priority',Tasks.assignmentsController,'_contentHasChanged');
      task.removeObserver('status',Tasks.assignmentsController,'_contentHasChanged');
      task.removeObserver('effort',Tasks.assignmentsController,'_contentHasChanged');
      task.addObserver('assignee',Tasks.assignmentsController,'_contentHasChanged');
      task.addObserver('priority',Tasks.assignmentsController,'_contentHasChanged');
      task.addObserver('status',Tasks.assignmentsController,'_contentHasChanged');
      task.addObserver('effort',Tasks.assignmentsController,'_contentHasChanged');
      
      // Extract/total effort for each incomplete taek (simple number or a range)
      if(task.get('status') === CoreTasks.TASK_STATUS_DONE) continue;
      effortString = task.get('effort');
      var priority = task.get('priority');
      if(!effortString && priority !== CoreTasks.TASK_PRIORITY_LOW) taskWithUnspecifiedEffort = true;
      if(effortString && priority !== CoreTasks.TASK_PRIORITY_LOW) {
        // sum up effort for High/Medium priority tasks
        effortMin = parseFloat(parseFloat(effortString, 10).toFixed(2));
        var idx = effortString.indexOf('-'); // see if effort is a range
        if(idx === -1) { // not a range
          effortMax = effortMin;
        }
        else { // effort IS a range, extract max
          effortMax = parseFloat(parseFloat(effortString.slice(idx+1), 10).toFixed(2));
        }
        totalEffortMin = parseFloat((totalEffortMin + effortMin).toFixed(2));
        totalEffortMax = parseFloat((totalEffortMax + effortMax).toFixed(2));
      }
    }
  
    var loading = CoreTasks.USER_NOT_LOADED;
    if(totalEffortMin !== 0) {
      if(projectTimeLeft) { // flag user loading
        var totalEffortAve = (totalEffortMin + totalEffortMax)/2;
        var effortGap = totalEffortAve - projectTimeLeft;
        var effortGapPercent = 100*effortGap/projectTimeLeft;
        if(effortGap < 1 && effortGapPercent < -15) loading = CoreTasks.USER_UNDER_LOADED;
        else if(effortGap > 1 && effortGapPercent > 15) loading = CoreTasks.USER_OVER_LOADED;
        else loading = CoreTasks.USER_PROPERLY_LOADED;
      }
      var totalEffort = '' + totalEffortMin;
      if (totalEffortMax !== totalEffortMin) {
        totalEffort += '-' + totalEffortMax;
      }
      displayName = displayName + ' {' + totalEffort + (taskWithUnspecifiedEffort? '?' : '') + '}';
    }
    
    assignmentNodes.push (SC.Object.create({
      displayName: displayName,
      loading: loading,
      assignee: assigneeObj.assignee,
      treeItemChildren: tasks.sort(function(a,b) { // sort by status, then by validation (if "Done"), then by priority, lastly by type
        
        var aStatus = a.get('status');
        var bStatus = b.get('status');
        if(aStatus !== bStatus) return CoreTasks.taskStatusWeights[bStatus] - CoreTasks.taskStatusWeights[aStatus];
        
        if(aStatus === CoreTasks.TASK_STATUS_DONE) {
          var aValidation = a.get('validation');
          var bValidation = b.get('validation');
          if(aValidation !== bValidation) return CoreTasks.taskValidationWeights[bValidation] - CoreTasks.taskValidationWeights[aValidation];
        }
        
        var aPriority = a.get('priority');
        var bPriority = b.get('priority');
        if(aPriority !== bPriority) return CoreTasks.taskPriorityWeights[bPriority] - CoreTasks.taskPriorityWeights[aPriority];
        
        return CoreTasks.taskTypeWeights[b.get('type')] - CoreTasks.taskTypeWeights[a.get('type')];
        
      }),
      treeItemIsExpanded: YES
    }));
  },
  
  _contentHasChanged: function() {
    // console.log("DEBUG: Tasks content changed at: " + new Date().format('hh:mm:ss a'));
  	if (this._timer) { // called as a result of a timer set for assignee selection or search filter changes
      this._timer.invalidate();
      this._timer = null;
    }
  	this.invokeOnce(this.showAssignments);
  }.observes('[]'),
  
  _filteringHasChanged: function() { // allow users to change filters over a half second before redrawing tasks pane
    if (this._timer) this._timer.invalidate();
    this._timer = this.invokeLater(this._contentHasChanged, 500);
  },
  
  _assigneeSelectionHasChanged: function() {
    // console.log("DEBUG: Assignee selection changed: '" + this.assigneeSelection + "'");
    this._filteringHasChanged();
  }.observes('assigneeSelection'),
  
  _searchFilterHasChanged: function() {
    // console.log("DEBUG: Search filter changed: '" + this.searchFilter + "'");
    this._filteringHasChanged();
  }.observes('searchFilter')
  
});
