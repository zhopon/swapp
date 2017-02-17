// targets.liked
// targets.notLiked
// targets.unseen
// targets.matching

import { Meteor } from 'meteor/meteor';
import { Likes } from '../likes.js';
import { Cards } from '../../cards/cards.js';

Meteor.publish('cards.matching', function () {
    const matchingCardIds = Likes
        .findUserMatches({ userId: this.userId})
        .map(function (match) {
            return match.target._id;
        });

    console.log(matchingCardIds);

    return Cards.find({ _id: {$in: matchingCardIds}});
});