
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Polls.GeneratedPoll = SC.Record.extend(
/** Polls.Poll.prototype */ {

/**
@type String
*/
question: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "question", "maxLength": 255, "unique": false, "verboseName": "question", "hasServerIndex": false}),

/**
@type String
*/
slug: SC.Record.attr(Django.SlugField, {"fieldClass": "SlugField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "slug", "maxLength": 50, "unique": true, "verboseName": "slug", "hasServerIndex": true}),

/**
@type Auth.User
*/
author: SC.Record.toOne('Auth.User', {"isMaster": true, "inverse": "pollSet", "fieldClass": "ForeignKey", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "author", "unique": false, "verboseName": "author", "hasServerIndex": true}),

/**
@type Date
*/
pubDate: SC.Record.attr(Django.DateTimeField, {"autoNowAdd": false, "fieldClass": "DateTimeField", "isEditable": true, "defaultValue": "2009-09-26 19:34:37", "autoNow": false, "isRequired": true, "key": "pub_date", "unique": false, "verboseName": "pub date", "hasServerIndex": false}),

/**
@type SC.RecordArray Polls.Choice
*/
choiceSet: SC.Record.toMany('Polls.Choice', {"isMaster": false, "inverse": "poll", "key": "choice_set", "fieldClass": "ForeignKey"}),

primaryKey: 'pk'

});

SC.mixin(Polls.GeneratedPoll,
/** @scope Polls.Poll */ {

ordering: [],

transformedFrom: "Django",

verboseNamePlural: "Polls",

modelClass: "polls.poll",

uniqueTogether: [],

verboseName: "Poll"

});
