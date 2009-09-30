
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Contenttypes.GeneratedContentType = SC.Record.extend(
/** Contenttypes.ContentType.prototype */ {

/**
@type String
*/
name: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "name", "maxLength": 100, "unique": false, "verboseName": "name", "hasServerIndex": false}),

/**
@type String
*/
appLabel: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "app_label", "maxLength": 100, "unique": false, "verboseName": "app label", "hasServerIndex": false}),

/**
@type String
*/
pythonModelClassName: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "model", "maxLength": 100, "unique": false, "verboseName": "python model class name", "hasServerIndex": false}),

/**
@type SC.RecordArray Auth.Permission
*/
permissionSet: SC.Record.toMany('Auth.Permission', {"isMaster": false, "inverse": "contentType", "key": "permission_set", "fieldClass": "ForeignKey"}),

/**
@type SC.RecordArray Admin.LogEntry
*/
logentrySet: SC.Record.toMany('Admin.LogEntry', {"isMaster": false, "inverse": "contentType", "key": "logentry_set", "fieldClass": "ForeignKey"}),

primaryKey: 'pk'

});

SC.mixin(Contenttypes.GeneratedContentType,
/** @scope Contenttypes.ContentType */ {

ordering: ["name"],

transformedFrom: "Django",

verboseNamePlural: "Content Types",

modelClass: "contenttypes.contenttype",

uniqueTogether: [["app_label", "model"]],

verboseName: "Content Type"

});
