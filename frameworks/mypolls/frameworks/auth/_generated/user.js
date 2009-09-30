
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Auth.GeneratedUser = SC.Record.extend(
/** Auth.User.prototype */ {

/**
@type String

Required. 30 characters or fewer. Alphanumeric characters only (letters, digits and underscores).
*/
username: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "username", "maxLength": 30, "unique": true, "verboseName": "username", "hasServerIndex": false}),

/**
@type String
*/
firstName: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": false, "key": "first_name", "maxLength": 30, "unique": false, "verboseName": "first name", "hasServerIndex": false}),

/**
@type String
*/
lastName: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": false, "key": "last_name", "maxLength": 30, "unique": false, "verboseName": "last name", "hasServerIndex": false}),

/**
@type String
*/
eMailAddress: SC.Record.attr(Django.EmailField, {"fieldClass": "EmailField", "isEditable": true, "defaultValue": null, "isRequired": false, "key": "email", "maxLength": 75, "unique": false, "verboseName": "e-mail address", "hasServerIndex": false}),

/**
@type String

Use '[algo]$[salt]$[hexdigest]' or use the <a href="password/">change password form</a>.
*/
password: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "password", "maxLength": 128, "unique": false, "verboseName": "password", "hasServerIndex": false}),

/**
@type Boolean

Designates whether the user can log into this admin site.
*/
staffStatus: SC.Record.attr(Django.BooleanField, {"fieldClass": "BooleanField", "isEditable": true, "defaultValue": false, "isRequired": false, "key": "is_staff", "unique": false, "verboseName": "staff status", "hasServerIndex": false}),

/**
@type Boolean

Designates whether this user should be treated as active. Unselect this instead of deleting accounts.
*/
active: SC.Record.attr(Django.BooleanField, {"fieldClass": "BooleanField", "isEditable": true, "defaultValue": true, "isRequired": false, "key": "is_active", "unique": false, "verboseName": "active", "hasServerIndex": false}),

/**
@type Boolean

Designates that this user has all permissions without explicitly assigning them.
*/
superuserStatus: SC.Record.attr(Django.BooleanField, {"fieldClass": "BooleanField", "isEditable": true, "defaultValue": false, "isRequired": false, "key": "is_superuser", "unique": false, "verboseName": "superuser status", "hasServerIndex": false}),

/**
@type Date
*/
lastLogin: SC.Record.attr(Django.DateTimeField, {"autoNowAdd": false, "fieldClass": "DateTimeField", "isEditable": true, "defaultValue": "2009-09-29 15:55:22", "autoNow": false, "isRequired": true, "key": "last_login", "unique": false, "verboseName": "last login", "hasServerIndex": false}),

/**
@type Date
*/
dateJoined: SC.Record.attr(Django.DateTimeField, {"autoNowAdd": false, "fieldClass": "DateTimeField", "isEditable": true, "defaultValue": "2009-09-29 15:55:22", "autoNow": false, "isRequired": true, "key": "date_joined", "unique": false, "verboseName": "date joined", "hasServerIndex": false}),

/**
@type SC.RecordArray Auth.Group

In addition to the permissions manually assigned, this user will also get all permissions granted to each group he/she is in. Hold down "Control", or "Command" on a Mac, to select more than one.
*/
groups: SC.Record.toMany('Auth.Group', {"isMaster": true, "inverse": "userSet", "fieldClass": "ManyToManyField", "isEditable": true, "defaultValue": null, "isRequired": false, "key": "groups", "unique": false, "verboseName": "groups", "hasServerIndex": false}),

/**
@type SC.RecordArray Auth.Permission

 Hold down "Control", or "Command" on a Mac, to select more than one.
*/
userPermissions: SC.Record.toMany('Auth.Permission', {"isMaster": true, "inverse": "userSet", "fieldClass": "ManyToManyField", "isEditable": true, "defaultValue": null, "isRequired": false, "key": "user_permissions", "unique": false, "verboseName": "user permissions", "hasServerIndex": false}),

/**
@type SC.RecordArray Auth.Message
*/
messageSet: SC.Record.toMany('Auth.Message', {"isMaster": false, "inverse": "user", "key": "message_set", "fieldClass": "ForeignKey"}),

/**
@type SC.RecordArray Admin.LogEntry
*/
logentrySet: SC.Record.toMany('Admin.LogEntry', {"isMaster": false, "inverse": "user", "key": "logentry_set", "fieldClass": "ForeignKey"}),

primaryKey: 'pk'

});

SC.mixin(Auth.GeneratedUser,
/** @scope Auth.User */ {

ordering: [],

transformedFrom: "Django",

verboseNamePlural: "Users",

modelClass: "auth.user",

uniqueTogether: [],

verboseName: "User"

});
