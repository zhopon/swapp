import './profile.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Cards } from '../../api/cards/cards.js';

// components used in this pages
import '../components/edit-card.js';

Template.Profile_show_page.onCreated(function () {
  this.subscribe('cards.user');
});

Template.Profile_show_page.helpers({
  user() {
    return Meteor.user();
  },

  card() {
    const userCard = Cards.findOne({ userId: Meteor.userId() });
    return userCard;
  }
});
