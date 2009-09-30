
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Auth.GeneratedGroup = SC.Record.extend(
/** Auth.Group.prototype */ {

/**
@type String
*/
name: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "name", "maxLength": 80, "unique": true, "verboseName": "name", "hasServerIndex": false}),

/**
@type SC.RecordArray Auth.Permission

 Hold down "Control", or "Command" on a Mac, to select more than one.
*/
permissions: SC.Record.toMany('Auth.Permission', {"isMaster": true, "inverse": "groupSet", "fieldClass": "ManyToManyField", "isEditable": true, "defaultValue": null, "isRequired": false, "key": "permissions", "unique": false, "verboseName": "permissions", "hasServerIndex": false}),

/**
@type SC.RecordArray Auth.User

In addition to the permissions manually assigned, this user will also get all permissions granted to each group he/she is in. Hold down "Control", or "Command" on a Mac, to select more than one.
*/
userSet: SC.Record.toMany('Auth.User', {"isMaster": false, "inverse": "groups", "key": "user_set", "fieldClass": "ManyToManyField"}),

primaryKey: 'pk'

});

SC.mixin(Auth.GeneratedGroup,
/** @scope Auth.Group */ {

ordering: [],

transformedFrom: "Django",

verboseNamePlural: "Groups",

modelClass: "auth.group",

uniqueTogether: [],

verboseName: "Group"

});
