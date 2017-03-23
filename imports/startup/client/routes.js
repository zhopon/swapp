import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import { FlowRouter } from 'meteor/kadira:flow-router';

import '/imports/ui/layouts/app-body.js';
import '/imports/ui/pages/cards.js';
import '/imports/ui/pages/profile.js';

FlowRouter.route('/', {
  name: 'Cards.show',
  action() {
    BlazeLayout.render('App_body', { main: 'Cards_show_page' });
  }
});

FlowRouter.route('/profile', {
  name: 'Profile.show',
  action() {
    BlazeLayout.render('App_body', { main: 'Profile_show_page' });
  }
});
