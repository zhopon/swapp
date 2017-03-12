import { Meteor } from 'meteor/meteor';
import { Likes } from './likes.js';

export const like = {
    name: 'likes.add',

    validate(args){
        // TODO
    },

    run({ targetId }) {
        // TODO: check targetId is indeed id

        // verify such objects exists in target collection
        let target = Likes.targetCollection().findOne({ _id: targetId });
        if (!target) {
            throw new Meteor.Error('likes.add.notFound', 'Target object id [' + targetId + '] not found.');
        }

        // add to likes collection only if not exists
        Likes.upsert(
            // selector
            {userId: this.userId, target: {_id: target._id, userId: target.userId}},
            // modifier
            {$set: {like: true}}
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
    [like.name]: function(args) {
        like.validate.call(this, args);
        like.run.call(this, args);
    }
});
