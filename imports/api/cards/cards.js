import { Mongo } from 'meteor/mongo';
import { Likes } from '../likes/likes.js';


class CardsCollection extends Mongo.Collection {

    liked({userId}) {
        const likedByUser = Likes.find({userId: userId , like: true}).map((like) => {
            return like.target._id;
        });
        return super.find({_id: {$in: likedByUser}});
    }

    notLiked({userId}) {
        const notLikedByUser = Likes.find({userId: userId, like: false}).map((like) => {
            return like.target._id;
        });
        return super.find({_id: {$in: notLikedByUser}});
    }

    unseen({userId}) {
        const likedByUser = Likes.find({userId: userId}).map((like) => {
            return like.target._id;
        });
        return super.find({
            _id: {$not: {$in: likedByUser}},
            userId: {$not: {$eq: userId}}
        });
    }
}

export const Cards = new CardsCollection('Cards');

Cards.helpers({

    like({userId}) {
        Likes.insert({
            userId: userId,
            target: this,
            like: true
        })
    },

    notLike({userId}) {
        Likes.insert({
            userId: userId,
            target: this,
            like: false
        })
    }

});