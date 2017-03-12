import { Mongo } from 'meteor/mongo';

/**
 * The matches collection
 *
 *
 *
 */
class LikesCollection extends Mongo.Collection {

    targetCollection(collection) {
        if (collection) {
            this._targetCollection = collection;
        }
        return this._targetCollection;
    }

    findUserMatches(userId) {
        const userLikes = super.find({userId: userId}, {fields: {'target.userId' : 1}});
        const otherUserIds = userLikes.map(function(like) {
            return like.target.userId;
        });

        return super.find({
            userId: {$in: otherUserIds},
            'target.userId': userId
        });
    }

    unseen({userId}, limit = 10) {
        const likedByUser = super.find({userId: userId}).map((like) => {
            return like.target._id;
        });
        return this.targetCollection().find({
            _id: {$not: {$in: likedByUser}},
            userId: {$not: {$eq: userId}}
        }, {
            limit
        });
    }

    liked({userId}) {
        const likedByUser = super.find({userId: userId , like: true}).map((like) => {
            return like.target._id;
        });
        return this.targetCollection().find({_id: {$in: likedByUser}});
    }

    notLiked({userId}) {
        const notLikedByUser = super.find({userId: userId, like: false}).map((like) => {
            return like.target._id;
        });
        return this.targetCollection().find({_id: {$in: notLikedByUser}});
    }

    matches({userId}) {
        const matchingCardIds = this
            .findUserMatches(userId)
            .map(function (match) {
                return match.target._id;
            });

        return this.targetCollection().find({ _id: {$in: matchingCardIds}});
    }

    like({card, userId}) {
        super.insert({
            userId: userId,
            target: card,
            like: true
        })
    }

    notLike({card, userId}) {
        super.insert({
            userId: userId,
            target: card,
            like: false
        })
    }
}

export const Likes = new LikesCollection('Likes');
