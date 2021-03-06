// ==========================================================================
// Project: Tasks
// ==========================================================================
/*globals CoreTasks Tasks */

/** 

  View/edit User information.
  
  @extends SC.View
  @author Suvajit Gupta
*/

Tasks.UserInformationView = SC.View.extend(
/** @scope Tasks.UserInformationView.prototype */ {
  
  _listRoles: function() {
     var ret = [];
     ret.push({ name: CoreTasks.USER_ROLE_MANAGER, value: CoreTasks.USER_ROLE_MANAGER, icon: 'user-role-manager' });
     ret.push({ name: Tasks.softwareMode? CoreTasks.USER_ROLE_DEVELOPER : "_User", value: CoreTasks.USER_ROLE_DEVELOPER, icon: 'user-role-developer' });
     if(Tasks.softwareMode) ret.push({ name: CoreTasks.USER_ROLE_TESTER, value: CoreTasks.USER_ROLE_TESTER, icon: 'user-role-tester' });
     ret.push({ name: CoreTasks.USER_ROLE_GUEST, value: CoreTasks.USER_ROLE_GUEST, icon: 'user-role-guest' });
     return ret;
  },

  createChildViews: function() {
    
    var childViews = [];
    
    this.fullNameLabel = this.createChildView(SC.LabelView.extend({
      layout: { top: 10, left: 0, width: 85, height: 18 },
      textAlign: SC.ALIGN_RIGHT,
      value: "_FullName:".loc() 
    }));
    childViews.push(this.fullNameLabel);
    this.fullNameField = this.createChildView(SC.TextFieldView.extend({
      layout: { top: 10, left: 90, height: 20, width: 300 },
      hint: "_FirstLast".loc(),
      valueBinding: SC.binding('*content.name', this).toLocale()
    }));
    childViews.push(this.fullNameField);
    
    this.loginNameLabel = this.createChildView(SC.LabelView.extend({
      layout: { top: 42, left: 0, width: 85, height: 18 },
      textAlign: SC.ALIGN_RIGHT,
      value: "_LoginName:".loc() 
    }));
    childViews.push(this.loginNameLabel);
    this.loginNameField = this.createChildView(SC.TextFieldView.extend({
      layout: { top: 42, left: 90, height: 20, width: 300 },
      hint: "_Initials".loc(),
      valueBinding: SC.binding('*content.loginNameValue', this).toLocale()
    }));
    childViews.push(this.loginNameField);
    
    this.passwordLabel = this.createChildView(SC.LabelView.extend({
      layout: { top: 74, left: 0, width: 85, height: 18 },
      textAlign: SC.ALIGN_RIGHT,
      value: "_Password:".loc(),
      icon: 'password-icon'
    }));
    childViews.push(this.passwordLabel);
    this.passwordField = this.createChildView(SC.TextFieldView.extend({
      layout: { top: 74, left: 90, height: 20, width: 300 },
      isPassword: YES,
      hint: "_PasswordHint".loc(),
      isPassword: YES,
      valueBinding: SC.binding('*content.unhashedPassword', this).toLocale()
    }));
    childViews.push(this.passwordField);
    
    this.emailLabel = this.createChildView(SC.LabelView.extend({
      layout: { top: 106, left: 0, width: 85, height: 18 },
      textAlign: SC.ALIGN_RIGHT,
      value: "_Email:".loc(),
      icon: 'email-icon'
    }));
    childViews.push(this.emailLabel);
    this.emailField = this.createChildView(SC.TextFieldView.extend(SC.Validatable,{
      layout: { top: 106, left: 90, height: 20, width: 300 },
      validator: SC.Validator.EmailOrEmpty,
      errorLabel: "_InvalidEmailAddress".loc(),
      hint: "_EmailAddress".loc(),
      valueBinding: SC.binding('*content.email', this).toLocale()
    }));
    childViews.push(this.emailField);
    this.emailHelpLabel =  this.createChildView(SC.LabelView.design({
      layout: { top: 131, left: 90, height: 20, width: 300 },
      escapeHTML: NO,
      classNames: ['onscreen-help'],
      value: "_EmailOnscreenHelp".loc()
    }));
    childViews.push(this.emailHelpLabel);
    
    this.roleLabel = this.createChildView(SC.LabelView.extend({
      layout: { top: 162, left: 0, width: 85, height: 18 },
      textAlign: SC.ALIGN_RIGHT,
      // isVisibleBinding: 'CoreTasks.permissions.canUpdateUserRole',
      value: "_Role:".loc()
    }));
    childViews.push(this.roleLabel);
    this.roleField = this.createChildView(SC.SelectButtonView.extend({
      layout: { top: 159, left: 90, height: 24, width: 150 },
      classNames: ['square'],
      localize: YES,
      // isVisibleBinding: 'CoreTasks.permissions.canUpdateUserRole',
      isEnabledBinding: 'CoreTasks.permissions.canUpdateUserRole',
      objects: this._listRoles(),
      nameKey: 'name',
      valueKey: 'value',
      iconKey: 'icon',
      valueBinding: SC.binding('*content.role', this)
    }));
    childViews.push(this.roleField);
    
    this.set('childViews', childViews);
    
  }

});