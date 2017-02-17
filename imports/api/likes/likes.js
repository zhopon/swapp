/**
 * The matches collection
 *
 *
 *
 */
class LikesCollection extends Mongo.Collection {

    findUserMatches(userId) {
        const userLikes = super.find({userId: userId}, {fields: {'target.userId' : 1}});
        const otherUserIds = userLikes.map(function(like) {
            return like.target.userId;
        });
        return super.find({userId: {$in: otherUserIds}, 'target.userId': userId});
    }

}

export const Likes = new LikesCollection('Likes');