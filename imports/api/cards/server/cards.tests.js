import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';
import { Cards } from '../cards.js';
import { chai, assert } from 'meteor/practicalmeteor:chai';
import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { _ } from 'meteor/underscore';
import './publications.js';

describe('cards', function () {
    describe('methods', function () {
        const userId = Random.id();
        beforeEach(function () {
            resetDatabase();
        });
        it('counts unseen cards', function() {
            assert.equal(Cards.unseen({userId}).count(), 0);
            Cards.insert({_id: 'card_id_1'});
            assert.equal(Cards.unseen({userId}).count(), 1);
        });
        it('marks a card as liked', function() {
            Cards.insert({_id: 'card_id_1'});
            const card = Cards.findOne({_id: 'card_id_1'});
            card.like({userId});
            assert.equal(Cards.unseen({userId}).count(), 0);
            assert.equal(Cards.liked({userId}).count(), 1);
        });
        it('marks a card as not liked', function() {
            Cards.insert({_id: 'card_id_1'});
            const card = Cards.findOne({_id: 'card_id_1'});
            card.notLike({userId});
            assert.equal(Cards.unseen({userId}).count(), 0);
            assert.equal(Cards.notLiked({userId}).count(), 1);
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
        describe('cards.unseen', function () {
            const collector = new PublicationCollector({ userId: userId1 });
            it('sends unseen cards', function (done) {
                collector.collect('cards.unseen', (collections) => {
                    chai.assert.equal(collections.Cards.length, 3);
                    done();
                })
            });
            it('sends only other users cards', function (done) {
                collector.collect('cards.unseen', (collections) => {
                    collections.Cards.map((card) => {
                        chai.assert.notEqual(card.userId, userId1);
                    });
                    done();
                })
            });
        });
    });
});