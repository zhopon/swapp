import { Cards } from '/imports/api/cards/cards.js';
import { Accounts } from 'meteor/accounts-base';
import fs from 'fs';


const path = fs.realpathSync('../../../../../public/userdata/pictures');
const paths = fs.readdirSync(path);

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
            const pid = paths[Math.floor(Math.random() * paths.length)];
            Cards.insert({
                name: 'tra la la',
                userId: userId,
                images: fs.readdirSync(path + '/' + pid).map(function(file) {
                  return { src: 'userdata/pictures/' + pid + '/' + file };
                })
            });
        })
    }
});
