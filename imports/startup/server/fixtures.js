import { Cards } from '/imports/api/cards/cards.js';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
    if (Cards.find().count() === 0) {

        // Create 1000 users
        let userIds = [];
        for (let i=1; i<=10; i++) {
            let userId = Accounts.createUser({
                username: 'user-' + i,
                password: '123456'
            });
            userIds.push(userId);
        }

        // Create a card for each
        userIds.forEach(function(userId) {
            Cards.insert({
                name: 'tra la la',
                userId: userId
            });
        })
    }
});
