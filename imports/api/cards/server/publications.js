import { Meteor } from 'meteor/meteor';
import { Cards } from '../cards.js';

Meteor.publish('cards.unseen', function () {
    return Cards.unseen({ userId: this.userId });
});

Meteor.publish('cards.matches', function () {
    return Cards.matches({ userId: this.userId });
});