import './cards.html';
import { Cards } from '/imports/api/cards/cards.js';
import { Template } from 'meteor/templating';


Template.Cards_show_page.helpers({

    cards() {
        return Cards.find();
    }

});