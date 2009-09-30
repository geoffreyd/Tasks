
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Sessions.GeneratedSession = SC.Record.extend(
/** Sessions.Session.prototype */ {

/**
@type String
*/
sessionData: SC.Record.attr(Django.TextField, {"fieldClass": "TextField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "session_data", "unique": false, "verboseName": "session data", "hasServerIndex": false}),

/**
@type Date
*/
expireDate: SC.Record.attr(Django.DateTimeField, {"autoNowAdd": false, "fieldClass": "DateTimeField", "isEditable": true, "defaultValue": null, "autoNow": false, "isRequired": true, "key": "expire_date", "unique": false, "verboseName": "expire date", "hasServerIndex": false}),

primaryKey: 'pk'

});

SC.mixin(Sessions.GeneratedSession,
/** @scope Sessions.Session */ {

ordering: [],

transformedFrom: "Django",

verboseNamePlural: "Sessions",

modelClass: "sessions.session",

uniqueTogether: [],

verboseName: "Session"

});
