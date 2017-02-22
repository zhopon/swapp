import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { Likes } from '../likes.js';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import './publications.js';

const userId1 = 'user_1';
const userId2 = 'user_2';
const userId3 = 'user_3';
const obj1 = {userId: userId1, _id: 'user_obj_1'};
const obj2 = {userId: userId2, _id: 'user_obj_2'};
const obj3 = {userId: userId3, _id: 'user_obj_3'};

describe('likes', function () {
    describe('methods', function () {
        beforeEach(function () {
            resetDatabase();
        });
        it('has no matches when two users like some other users object', function () {
            Likes.insert({userId: userId1, target: obj3});
            Likes.insert({userId: userId2, target: obj3});
            assert.equal(Likes.findUserMatches(userId1).count(), 0);
            assert.equal(Likes.findUserMatches(userId2).count(), 0);
            assert.equal(Likes.findUserMatches(userId3).count(), 0);
        });
        it('has a match when two users like each others object', function () {
            Likes.insert({userId: userId1, target: obj2});
            Likes.insert({userId: userId2, target: obj1});
            assert.equal(Likes.findUserMatches(userId1).count(), 1);
            assert.equal(Likes.findUserMatches(userId2).count(), 1);
            assert.equal(Likes.findUserMatches(userId3).count(), 0);
        });
    });
});
