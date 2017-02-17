import { Cards } from '/imports/api/cards/cards.js';

Meteor.startup(() => {
    if (Cards.find().count() === 0) {

        Cards.insert({name: 'tra la la'});

    }
});
