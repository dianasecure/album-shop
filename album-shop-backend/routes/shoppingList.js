import express from 'express';
const router = express.Router();
import shoppingListController from '../controllers/shoppingListController.js';
import authenticateToken from '../middleware/auth.js';

router.use(authenticateToken);

router.get('/', shoppingListController.getShoppingList);
router.post('/', shoppingListController.addToShoppingList);
router.put('/:id', shoppingListController.updateQuantity);
router.delete('/:id', shoppingListController.removeFromShoppingList);

export default router;