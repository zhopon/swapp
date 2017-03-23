import { Meteor } from 'meteor/meteor';
import { Cards } from '../cards.js';

Meteor.publish('cards.user', function () {
  return Cards.find({ userId: this.userId });
});
