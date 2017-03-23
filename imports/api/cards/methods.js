import { Meteor } from 'meteor/meteor';
import { Cards } from './cards.js';

export const updateCard = {
    name: 'cards.update',

    validate(args){

    },

    run({ _id, description }) {
        let card = Cards.findOne({ _id });
        if (!card) {
          // make sure this user don't have cards at all
          if (Cards.findOne({ userId: this.userId })) {
            throw new Meteor.error('cards.update.notFound', 'Card with id [' + id + '] not found.');
          }
          card = {
            userId: this.userId,
            images: []
          };
        }

        if (card.userId !== this.userId) {
          throw new Meteor.error('cards.update.notAllowed', 'You are not allowed to edit other users cards.');
        }

        card.description = description;

        // TODO: update images array
        Cards.upsert(
            // selector
            {_id: _id, userId: card.userId},
            // modifier
            {$set: {description: card.description}}
        );
    },

    call(args, callback) {
        const options = {
            returnStubValue: false, // this way simulated values will return the doc id
            throwStubException: true // avoid calling the server in case of validation failure on client
        };

        Meteor.apply(this.name, [args], options, callback);
    }
};

// Register the methods with Meteor DDP

Meteor.methods({
    [updateCard.name]: function(args) {
        updateCard.validate.call(this, args);
        updateCard.run.call(this, args);
    }
});
