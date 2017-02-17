import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts/app-body';
import '/imports/ui/pages/cards';

BlazeLayout.render('App_body', { main: 'Cards_show_page' });