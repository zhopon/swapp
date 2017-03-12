// targets.liked
// targets.notLiked
// targets.unseen
// targets.matching

import { Meteor } from 'meteor/meteor';
import { Likes } from '../likes.js';

Meteor.publish('cards.unseen', function () {
    const userId = this.userId;
    const cards = Likes.unseen({userId});
    const users = Meteor.users.find({ _id: {$in: cards.map(function (card) {
        return card.userId;
    })}});

    return [cards, users, Likes.find({userId})];
});

Meteor.publish('cards.matches', function () {
    return Likes.matches({ userId: this.userId });
});
