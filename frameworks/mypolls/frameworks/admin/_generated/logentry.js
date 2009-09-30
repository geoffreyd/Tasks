
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Admin.GeneratedLogEntry = SC.Record.extend(
/** Admin.LogEntry.prototype */ {

/**
@type Date
*/
actionTime: SC.Record.attr(Django.DateTimeField, {"autoNowAdd": false, "fieldClass": "DateTimeField", "isEditable": false, "defaultValue": null, "autoNow": true, "isRequired": false, "key": "action_time", "unique": false, "verboseName": "action time", "hasServerIndex": false}),

/**
@type Auth.User
*/
user: SC.Record.toOne('Auth.User', {"isMaster": true, "inverse": "logentrySet", "fieldClass": "ForeignKey", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "user", "unique": false, "verboseName": "user", "hasServerIndex": true}),

/**
@type Contenttypes.ContentType
*/
contentType: SC.Record.toOne('Contenttypes.ContentType', {"isMaster": true, "inverse": "logentrySet", "fieldClass": "ForeignKey", "isEditable": true, "defaultValue": null, "isRequired": false, "key": "content_type", "unique": false, "verboseName": "content type", "hasServerIndex": true}),

/**
@type String
*/
objectId: SC.Record.attr(Django.TextField, {"fieldClass": "TextField", "isEditable": true, "defaultValue": null, "isRequired": false, "key": "object_id", "unique": false, "verboseName": "object id", "hasServerIndex": false}),

/**
@type String
*/
objectRepr: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "object_repr", "maxLength": 200, "unique": false, "verboseName": "object repr", "hasServerIndex": false}),

/**
@type Positive integer
*/
actionFlag: SC.Record.attr(Django.PositiveSmallIntegerField, {"fieldClass": "PositiveSmallIntegerField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "action_flag", "unique": false, "verboseName": "action flag", "hasServerIndex": false}),

/**
@type String
*/
changeMessage: SC.Record.attr(Django.TextField, {"fieldClass": "TextField", "isEditable": true, "defaultValue": null, "isRequired": false, "key": "change_message", "unique": false, "verboseName": "change message", "hasServerIndex": false}),

primaryKey: 'pk'

});

SC.mixin(Admin.GeneratedLogEntry,
/** @scope Admin.LogEntry */ {

ordering: ["-action_time"],

transformedFrom: "Django",

verboseNamePlural: "Log Entries",

modelClass: "admin.logentry",

uniqueTogether: [],

verboseName: "Log Entry"

});
