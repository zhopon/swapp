import { Mongo } from 'meteor/mongo';

class CardsCollection extends Mongo.Collection {


}

export const Cards = new CardsCollection('Cards');