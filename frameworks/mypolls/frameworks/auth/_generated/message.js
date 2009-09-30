
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Auth.GeneratedMessage = SC.Record.extend(
/** Auth.Message.prototype */ {

/**
@type Auth.User
*/
user: SC.Record.toOne('Auth.User', {"isMaster": true, "inverse": "messageSet", "fieldClass": "ForeignKey", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "user", "unique": false, "verboseName": "user", "hasServerIndex": true}),

/**
@type String
*/
message: SC.Record.attr(Django.TextField, {"fieldClass": "TextField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "message", "unique": false, "verboseName": "message", "hasServerIndex": false}),

primaryKey: 'pk'

});

SC.mixin(Auth.GeneratedMessage,
/** @scope Auth.Message */ {

ordering: [],

transformedFrom: "Django",

verboseNamePlural: "Messages",

modelClass: "auth.message",

uniqueTogether: [],

verboseName: "Message"

});
