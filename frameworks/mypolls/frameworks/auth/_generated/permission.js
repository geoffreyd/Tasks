
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Auth.GeneratedPermission = SC.Record.extend(
/** Auth.Permission.prototype */ {

/**
@type String
*/
name: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "name", "maxLength": 50, "unique": false, "verboseName": "name", "hasServerIndex": false}),

/**
@type Contenttypes.ContentType
*/
contentType: SC.Record.toOne('Contenttypes.ContentType', {"isMaster": true, "inverse": "permissionSet", "fieldClass": "ForeignKey", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "content_type", "unique": false, "verboseName": "content type", "hasServerIndex": true}),

/**
@type String
*/
codename: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "codename", "maxLength": 100, "unique": false, "verboseName": "codename", "hasServerIndex": false}),

/**
@type SC.RecordArray Auth.Group

 Hold down "Control", or "Command" on a Mac, to select more than one.
*/
groupSet: SC.Record.toMany('Auth.Group', {"isMaster": false, "inverse": "permissions", "key": "group_set", "fieldClass": "ManyToManyField"}),

/**
@type SC.RecordArray Auth.User

 Hold down "Control", or "Command" on a Mac, to select more than one.
*/
userSet: SC.Record.toMany('Auth.User', {"isMaster": false, "inverse": "userPermissions", "key": "user_set", "fieldClass": "ManyToManyField"}),

primaryKey: 'pk'

});

SC.mixin(Auth.GeneratedPermission,
/** @scope Auth.Permission */ {

ordering: ["content_type__app_label", "codename"],

transformedFrom: "Django",

verboseNamePlural: "Permissions",

modelClass: "auth.permission",

uniqueTogether: [["content_type", "codename"]],

verboseName: "Permission"

});
