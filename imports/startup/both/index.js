import './user-accounts.js';

// Setup matches mechanism
import { Likes } from '../../api/likes/likes.js';
import { Cards } from '../../api/cards/cards.js';

Likes.targetCollection(Cards);

import '../../api/likes/methods.js';
