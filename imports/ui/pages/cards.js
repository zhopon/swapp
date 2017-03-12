import './cards.html';
import { Meteor } from 'meteor/meteor';
import { Likes } from '../../api/likes/likes.js';
import { Template } from 'meteor/templating';
import { like } from '../../api/likes/methods.js';

Template.Cards_show_page.onCreated(function () {
    this.subscribe('cards.unseen');
});

Template.Cards_show_page.helpers({

    cards() {
        return Likes.unseen({ userId: Meteor.userId() });
    },

    username(card) {
        return Meteor.users.findOne({ _id: card.userId }).username;
    }
});

Template.Cards_show_page.events({
    'click .like'(e) {
        const cards = Likes.unseen({ userId: Meteor.userId() }).fetch();
        like.call({ targetId: cards[0]._id }, (err, res) => {
            if (err) {
                alert(err);
            }
        });
    }
});
