
//WARNING: THIS FILE IS GENERATED AUTOMATICALLY AND MAY BE OVERWRITTEN.
//IF YOU WISH TO MAKE CHANGES, SUBCLASS THE MODEL AND MAKE CHANGES THERE.

/** @private */
Sites.GeneratedSite = SC.Record.extend(
/** Sites.Site.prototype */ {

/**
@type String
*/
domainName: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "domain", "maxLength": 100, "unique": false, "verboseName": "domain name", "hasServerIndex": false}),

/**
@type String
*/
displayName: SC.Record.attr(Django.CharField, {"fieldClass": "CharField", "isEditable": true, "defaultValue": null, "isRequired": true, "key": "name", "maxLength": 50, "unique": false, "verboseName": "display name", "hasServerIndex": false}),

primaryKey: 'pk'

});

SC.mixin(Sites.GeneratedSite,
/** @scope Sites.Site */ {

ordering: ["domain"],

transformedFrom: "Django",

verboseNamePlural: "Sites",

modelClass: "sites.site",

uniqueTogether: [],

verboseName: "Site"

});
