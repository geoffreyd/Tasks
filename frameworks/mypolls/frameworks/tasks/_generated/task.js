
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Tasks.GeneratedTask = SC.Record.extend(
/** Tasks.Task.prototype */ {

/**
@type Tasks.Project
*/
project: SC.Record.toOne('Tasks.Project', {"isMaster": true, "inverse": "tasks", "fieldClass": "ForeignKey", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "project", "unique": false, "verboseName": "project", "hasServerIndex": true}),

/**
@type String
*/
name: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "name", "maxLength": 250, "unique": false, "verboseName": "name", "hasServerIndex": false}),

/**
@type String
*/
description: SC.Record.attr(Django.TextField, {"fieldClass": "TextField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "description", "unique": false, "verboseName": "description", "hasServerIndex": false}),

/**
@type String
*/
taskType: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "task_type", "maxLength": 250, "unique": false, "verboseName": "task type", "hasServerIndex": false}),

/**
@type String
*/
priority: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "priority", "maxLength": 250, "unique": false, "verboseName": "priority", "hasServerIndex": false}),

/**
@type String
*/
statusValue: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "status_value", "maxLength": 250, "unique": false, "verboseName": "status value", "hasServerIndex": false}),

/**
@type String
*/
validation: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "validation", "maxLength": 250, "unique": false, "verboseName": "validation", "hasServerIndex": false}),

/**
@type String
*/
effort: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "effort", "maxLength": 250, "unique": false, "verboseName": "effort", "hasServerIndex": false}),

/**
@type String
*/
submitter: SC.Record.attr(Django.EmailField, {"fieldClass": "EmailField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "submitter", "maxLength": 75, "unique": false, "verboseName": "submitter", "hasServerIndex": false}),

/**
@type String
*/
assignee: SC.Record.attr(Django.EmailField, {"fieldClass": "EmailField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "assignee", "maxLength": 75, "unique": false, "verboseName": "assignee", "hasServerIndex": false}),

primaryKey: 'pk'

});

SC.mixin(Tasks.GeneratedTask,
/** @scope Tasks.Task */ {

ordering: [],

transformedFrom: "Django",

verboseNamePlural: "Tasks",

modelClass: "tasks.task",

uniqueTogether: [],

verboseName: "Task"

});
