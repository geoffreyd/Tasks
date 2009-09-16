/*globals CoreTasks sc_require */

sc_require('models/record');

CoreTasks.NEW_TASK_NAME = '_NewTask';

// Types:
CoreTasks.TASK_TYPE_FEATURE = '_Feature'; // default
CoreTasks.TASK_TYPE_BUG = '_Bug';
CoreTasks.TASK_TYPE_OTHER = '_Other';

CoreTasks.taskTypeWeights = {};
CoreTasks.taskTypeWeights[CoreTasks.TASK_TYPE_FEATURE] = 3;
CoreTasks.taskTypeWeights[CoreTasks.TASK_TYPE_BUG] = 2;
CoreTasks.taskTypeWeights[CoreTasks.TASK_TYPE_OTHER] = 1;


// Priorities:
CoreTasks.TASK_PRIORITY_HIGH = '_High';
CoreTasks.TASK_PRIORITY_MEDIUM = '_Medium'; // default
CoreTasks.TASK_PRIORITY_LOW = '_Low';

CoreTasks.taskPriorityWeights = {};
CoreTasks.taskPriorityWeights[CoreTasks.TASK_PRIORITY_HIGH] = 3;
CoreTasks.taskPriorityWeights[CoreTasks.TASK_PRIORITY_MEDIUM] = 2;
CoreTasks.taskPriorityWeights[CoreTasks.TASK_PRIORITY_LOW] = 1;


// Development status:
CoreTasks.TASK_STATUS_PLANNED = '_Planned'; // default
CoreTasks.TASK_STATUS_ACTIVE = '_Active';
CoreTasks.TASK_STATUS_DONE = '_Done';
CoreTasks.TASK_STATUS_RISKY = '_Risky';

CoreTasks.taskStatusWeights = {};
CoreTasks.taskStatusWeights[CoreTasks.TASK_STATUS_DONE] = 4;
CoreTasks.taskStatusWeights[CoreTasks.TASK_STATUS_ACTIVE] = 3;
CoreTasks.taskStatusWeights[CoreTasks.TASK_STATUS_PLANNED] = 2;
CoreTasks.taskStatusWeights[CoreTasks.TASK_STATUS_RISKY] = 1;


// Validation status:
CoreTasks.TASK_VALIDATION_UNTESTED = '_Untested'; // default
CoreTasks.TASK_VALIDATION_PASSED = '_Passed';
CoreTasks.TASK_VALIDATION_FAILED = '_Failed';

CoreTasks.taskValidationWeights = {};
CoreTasks.taskValidationWeights[CoreTasks.TASK_VALIDATION_PASSED] = 3;
CoreTasks.taskValidationWeights[CoreTasks.TASK_VALIDATION_FAILED] = 2;
CoreTasks.taskValidationWeights[CoreTasks.TASK_VALIDATION_UNTESTED] = 1;


/**
 * The task model.
 *
 * A task represent an atomic unit of work to be done by someone.  They are grouped in projects.
 *
 * @extends CoreTasks.Record
 * @author Suvajit Gupta
 * @author Sean Eidemiller
 */
CoreTasks.Task = CoreTasks.Record.extend({

  /**
   * A one-line summary of the task.
   */
  name: SC.Record.attr(String, { isRequired: YES, defaultValue: CoreTasks.NEW_TASK_NAME }),

  /**
   * Multi-line comments about the task (may be release notes for a feature or steps to reproduce a bug)
   */
  description: SC.Record.attr(String),

  /**
   * The type of the task (see below for possible values).
   */
  type: SC.Record.attr(String, {
    isRequired: YES,
    defaultValue: CoreTasks.TASK_TYPE_OTHER,
    allowed: [
      CoreTasks.TASK_TYPE_FEATURE,
      CoreTasks.TASK_TYPE_BUG,
      CoreTasks.TASK_TYPE_OTHER
    ]
  }),

  /**
   * The proiority of the task (HIGH indicates task must be completed, LOW ones are not used for effort subtotals).
   */
  priority: SC.Record.attr(String, {
    isRequired: YES,
    defaultValue: CoreTasks.TASK_PRIORITY_MEDIUM,
    allowed: [
      CoreTasks.TASK_PRIORITY_HIGH,
      CoreTasks.TASK_PRIORITY_MEDIUM,
      CoreTasks.TASK_PRIORITY_LOW
    ]
  }),

  /**
   * The development status of the task (see below for allowed values).
   */
  status: SC.Record.attr(String, {
    isRequired: YES,
    defaultValue: CoreTasks.TASK_STATUS_PLANNED,
    allowed: [
      CoreTasks.TASK_STATUS_PLANNED,
      CoreTasks.TASK_STATUS_ACTIVE,
      CoreTasks.TASK_STATUS_DONE,
      CoreTasks.TASK_STATUS_RISKY
    ]
   }),

  /**
   * The validation status of the task (see below for allowed values).
   */
  validation: SC.Record.attr(String, {
    isRequired: YES,
    defaultValue: CoreTasks.TASK_VALIDATION_UNTESTED,
    allowed: [
      CoreTasks.TASK_VALIDATION_UNTESTED,
      CoreTasks.TASK_VALIDATION_PASSED,
      CoreTasks.TASK_VALIDATION_FAILED
    ]
  }),

  /**
   * The effort of the task (can start with an estimate and end with the actual).
   */
  effort: SC.Record.attr(String),

  /**
   * The user who creates the task.
   */
  submitter: SC.Record.attr('CoreTasks.User'),
  
  submitterID: function(key, value){
    if (value) {
      this.set('submitter', CoreTasks.User.find(CoreTasks.store, value));
    }
    else {
      var submitter = this.get('submitter');
      if (submitter && submitter.get) { // FIXME: [SC] unclear why submitter.get() is null at times
        var id = submitter.get('id');
        return id;
      }
    }
  }.property('submitter').cacheable(),

  /**
  * The user who is assigned to complete the task.
   */
  assignee: SC.Record.attr('CoreTasks.User'),
  
  assigneeID: function(key, value){
    if (value) {
      this.set('assignee', CoreTasks.User.find(CoreTasks.store, value));
    }
    else {
      var assignee = this.get('assignee');
      if (assignee && assignee.get) { // FIXME: [SC] unclear why assigneee.get() is null at times
        var id = assignee.get('id');
        return id;
      }
    }
  }.property('assignee').cacheable(),

  /**
   * The order index of this task in the context of the project.
   */
  orderIndex: SC.Record.attr(Number, { defaultValue: 0 }),

  /**
   * The path to the icon associated with a task.
   */
  icon: function() {
    switch (this.get('type')){
      case CoreTasks.TASK_TYPE_FEATURE:
        return 'task-icon-feature';
      case CoreTasks.TASK_TYPE_BUG:
        return 'task-icon-bug';
      case CoreTasks.TASK_TYPE_OTHER:
        return 'task-icon-other';
    }
  }.property('type').cacheable(),

  /**
   * A string summarizing key facets of the Task for display.
   */
  displayName: function(key, value) {
    if (value !== undefined) {
      var taskHash = CoreTasks.Task.parse(value, false);
      // console.log("PARSED TASK: " + JSON.stringify(taskHash));
      
      if(taskHash.priority) {
        this.propertyWillChange('priority');
        this.writeAttribute('priority', taskHash.priority);
        this.propertyDidChange('priority');
      }
      
      this.propertyWillChange('name');
      this.writeAttribute('name', taskHash.name);
      this.propertyDidChange('name');
      
      this.propertyWillChange('effort');
      this.writeAttribute('effort', taskHash.effort);
      this.propertyDidChange('effort');
      
      if(taskHash.submitter) {
        this.propertyWillChange('submitter');
        var submitterUser = CoreTasks.getUser(taskHash.submitter);
        if (!submitterUser) console.log('Task Editing Error - no such submitter: ' + taskHash.submitter);
        else this.writeAttribute('submitter', submitterUser.get('id'));
        this.propertyDidChange('submitter');
      }
      
      if(taskHash.assignee) {
        this.propertyWillChange('assignee');
        var assigneeUser = CoreTasks.getUser(taskHash.assignee);
        if (!assigneeUser) console.log('Task Editing Error - no such assignee: ' + taskHash.assignee);
        else this.writeAttribute('assignee', assigneeUser.get('id'));
        this.propertyDidChange('assignee');
      }
      
      if(taskHash.type) {
        this.propertyWillChange('type');
        this.writeAttribute('type', taskHash.type);
        this.propertyDidChange('type');
      }
      
      if(taskHash.status) {
        this.propertyWillChange('status');
        this.writeAttribute('status', taskHash.status);
        this.propertyDidChange('status');
      }
      
      if(taskHash.validation) {
        this.propertyWillChange('validation');
        this.writeAttribute('validation', taskHash.validation);
        this.propertyDidChange('validation');
      }

    } else {
      var name = this.get('name');
      var effort = this.get('effort');
      var ret = name;
      if (effort) ret += ' {' + effort + '}';
      return ret;
    }
    
  }.property('name', 'effort').cacheable()  ,

  /**
  * Export a task's attributes.
  * @returns {String) return a string with the tasks' data exported in it.
  */
  exportData: function() {
    var ret = '', val, user;
    switch(this.get('priority')) {
      case CoreTasks.TASK_PRIORITY_HIGH: val = '^'; break;
      case CoreTasks.TASK_PRIORITY_MEDIUM: val = '-'; break;
      case CoreTasks.TASK_PRIORITY_LOW: val = 'v'; break;
    }
    ret += val + ' ';
    ret += this.get('displayName');
    user = this.get('submitter');
    if (user) ret += ' <' + user.get('loginName') + '>';
    user = this.get('assignee');
    if (user) ret += ' [' + user.get('loginName') + ']';
    val = this.get('type');
    if(val !== CoreTasks.TASK_TYPE_OTHER) ret += ' $' + val.loc();
    val = this.get('status');
    if(val !== CoreTasks.TASK_STATUS_PLANNED) ret += ' @' + val.loc();
    val = this.get('validation');
    if(val !== CoreTasks.TASK_VALIDATION_UNTESTED)ret += ' %' + val.loc();
    val = this.get('description');
    if(val) {
      var lines = val.split('\n');
      for (var j = 0; j < lines.length; j++) {
        ret += '\n| ' + lines[j];
      }
    }
    ret += '\n';
    return ret;
  }
  
});

CoreTasks.Task.mixin(/** @scope CoreTasks.Task */ {
  
  callbacks: SC.Object.create(),
  resourcePath: 'task',

  /**
   * Parse a line of text and extract parameters from it.
   *
   * @param {String} string to extract parameters from.
   * @param (Boolean) optional parameter to specify if defaults are to be filled in
   * @returns {Object} Hash of parsed parameters.
   */
  parse: function(line, fillDefaults) {

    if (fillDefaults === undefined) filldefaults = true;
    
    // extract priority based on bullet, if one
    var hasBullet = false;
    var taskPriority = fillDefaults? CoreTasks.TASK_PRIORITY_MEDIUM : null;
    if (line.charAt(0) === '^') {
      taskPriority = CoreTasks.TASK_PRIORITY_HIGH;
      hasBullet = true;
    } else if (line.charAt(0) === '-') {
      taskPriority = CoreTasks.TASK_PRIORITY_MEDIUM;
      hasBullet = true;
    } else if (line.charAt(0) === 'v') {
      taskPriority = CoreTasks.TASK_PRIORITY_LOW;
      hasBullet = true;
    }
    var taskLine = hasBullet? line.slice(2) : line;
    
    // extract task name
    var taskNameMatches = /(^[^\{<\[\$@%]+)/.exec(taskLine);
    var taskName = taskLine;
    if (taskNameMatches) {
      taskName = taskNameMatches[1].replace(/\s+$/, '');
    }
    
    // extract task effort
    var taskEffortMatches = /\{(\d+\.\d+-\d+\.\d+|\d+\.\d+-\d+|\d+-\d+\.\d+|\d+-\d+|\d+\.\d+|\d+)\}/.exec(taskLine);
    var taskEffort = null;
    if(taskEffortMatches) {
      taskEffort = taskEffortMatches[1]? taskEffortMatches[1] : taskEffortMatches[2];
    }
           
    // extract task assignee
    var taskAssignee = null;
    var taskAssigneeMatches = /\[([\w]+)\]/.exec(taskLine);
    if(taskAssigneeMatches) {
      taskAssignee = taskAssigneeMatches[1];
    }
    
    // extract task submitter
    var taskSubmitter = null;
    var taskSubmitterMatches = /\<([\w]+)\>/.exec(taskLine);
    if(taskSubmitterMatches) {
      taskSubmitter = taskSubmitterMatches[1];
    }
    
    // TODO: [SG] check for valid values during importing of task type/status/validation
    
    // extract task type
    var taskTypeMatches = /\$([\w]+)/.exec(taskLine);
    var taskType = fillDefaults? CoreTasks.TASK_TYPE_OTHER : null;
    if(taskTypeMatches) {
      taskType = '_' + taskTypeMatches[1];
    }
    
    // extract task status
    var taskStatusMatches = /@([\w]+)/.exec(taskLine);
    var taskStatus = fillDefaults? CoreTasks.TASK_STATUS_PLANNED : null;
    if(taskStatusMatches) {
      taskStatus = '_' + taskStatusMatches[1];
    }
    
    // extract task validation
    var taskValidationMatches = /%([\w]+)/.exec(taskLine);
    var taskValidation = fillDefaults? CoreTasks.TASK_VALIDATION_UNTESTED : null;
    if(taskValidationMatches) {
      taskValidation = '_' + taskValidationMatches[1];
    }
    
    return {
      name: taskName,
      priority: taskPriority,
      effort: taskEffort,
      assignee: taskAssignee,
      submitter: taskSubmitter,
      type: taskType,
      status: taskStatus,
      validation: taskValidation
    };
  }
  
});

CoreTasks.Task.NEW_TASK_HASH = {
  name: CoreTasks.NEW_TASK_NAME,
  type: CoreTasks.TASK_TYPE_OTHER,
  priority: CoreTasks.TASK_PRIORITY_MEDIUM,
  status: CoreTasks.TASK_STATUS_PLANNED,
  validation: CoreTasks.TASK_VALIDATION_UNTESTED
};
