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

resetDatabase();
const Cards = new Mongo.Collection('Test');
Likes.targetCollection(Cards);

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
    describe('methods', function () {
        const userId = Random.id();
        beforeEach(function () {
            resetDatabase();
        });
        it('counts unseen cards', function() {
            assert.equal(Likes.unseen({userId}).count(), 0);
            Cards.insert({_id: 'card_id_1'});
            assert.equal(Likes.unseen({userId}).count(), 1);
        });
        it('marks a card as liked', function() {
            Cards.insert({_id: 'card_id_1'});
            const card = Cards.findOne({_id: 'card_id_1'});
            Likes.like({card, userId});
            assert.equal(Likes.unseen({userId}).count(), 0);
            assert.equal(Likes.liked({userId}).count(), 1);
        });
        it('marks a card as not liked', function() {
            Cards.insert({_id: 'card_id_1'});
            const card = Cards.findOne({_id: 'card_id_1'});
            Likes.notLike({card, userId});
            assert.equal(Likes.unseen({userId}).count(), 0);
            assert.equal(Likes.notLiked({userId}).count(), 1);
        });
    });
    describe('publications', function () {
        const userId1 = Random.id();
        const userId2 = Random.id();
        const createCards = (props = {}) => {
            Cards.insert(props);
        };
        before(function () {
            resetDatabase();
            _.times(1, () => {
                createCards({ userId: userId1 });
            });
            _.times(1, () => {
                createCards({ userId: userId2});
            });
            _.times(2, () => {
                createCards({ userId: Random.id() });
            });
        });
        describe('likes.unseen', function () {
            it('has 4 cards in the collection', function () {
                assert.equal(Cards.find().count(), 4);
            });
            const collector = new PublicationCollector({ userId: userId1 });
            it('sends unseen cards', function (done) {
                collector.collect('cards.unseen', (collections) => {
                    assert.equal(collections.Test.length, 3);
                    done();
                })
            });
            it('sends only other users cards', function (done) {
                collector.collect('cards.unseen', (collections) => {
                    collections.Test.map((card) => {
                        assert.notEqual(card.userId, userId1);
                    });
                    done();
                })
            });
        });
        describe('likes.matches', function () {
            before(function () {
                const card1 = Cards.findOne({ userId: userId1});
                const card2 = Cards.findOne({ userId: userId2});
                Likes.like({card: card1, userId: userId2});
                Likes.like({card: card2, userId: userId1});
            });
            it('sends matching cards', function (done) {
                const collector = new PublicationCollector({ userId: userId1 });
                collector.collect('cards.matches', (collections) => {
                    assert.equal(collections.Test.length, 1);
                    done();
                });
            });
        });
    });
});
