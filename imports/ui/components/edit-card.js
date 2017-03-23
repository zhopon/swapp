import './edit-card.html';

import { updateCard } from '../../api/cards/methods.js';


Template.Edit_card.events({
  "submit #profile": function(event, template){
    event.preventDefault();
    const _id = this.card._id;
    const description = template.find('#description').value;
    updateCard.call({ _id, description});
  }
});
