
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Polls.GeneratedChoice = SC.Record.extend(
/** Polls.Choice.prototype */ {

/**
@type Polls.Poll
*/
poll: SC.Record.toOne('Polls.Poll', {"isMaster": true, "inverse": "choiceSet", "fieldClass": "ForeignKey", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "poll", "unique": false, "verboseName": "poll", "hasServerIndex": true}),

/**
@type String
*/
answer: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "answer", "maxLength": 255, "unique": false, "verboseName": "answer", "hasServerIndex": false}),

/**
@type Integer
*/
votes: SC.Record.attr(Django.IntegerField, {"fieldClass": "IntegerField", "isEditable": true, "defaultValue": 0, "isRequired": true, "key": "votes", "unique": false, "verboseName": "votes", "hasServerIndex": false}),

primaryKey: 'pk'

});

SC.mixin(Polls.GeneratedChoice,
/** @scope Polls.Choice */ {

ordering: [],

transformedFrom: "Django",

verboseNamePlural: "Choices",

modelClass: "polls.choice",

uniqueTogether: [],

verboseName: "Choice"

});
