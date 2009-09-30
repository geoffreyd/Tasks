
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Tasks.GeneratedProject = SC.Record.extend(
/** Tasks.Project.prototype */ {

/**
@type String
*/
name: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "name", "maxLength": 250, "unique": false, "verboseName": "name", "hasServerIndex": false}),

/**
@type Number
*/
timeLeft: SC.Record.attr(Django.FloatField, {"fieldClass": "FloatField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "time_left", "unique": false, "verboseName": "time left", "hasServerIndex": false}),

/**
@type SC.RecordArray Tasks.Task
*/
tasks: SC.Record.toMany('Tasks.Task', {"isMaster": false, "inverse": "project", "key": "tasks", "fieldClass": "ForeignKey"}),

primaryKey: 'pk'

});

SC.mixin(Tasks.GeneratedProject,
/** @scope Tasks.Project */ {

ordering: [],

transformedFrom: "Django",

verboseNamePlural: "Projects",

modelClass: "tasks.project",

uniqueTogether: [],

verboseName: "Project"

});
