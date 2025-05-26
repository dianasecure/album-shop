import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getShoppingList = async (req, res) => {
  const userId = req.user.userId;
  const items = await prisma.shoppingListItem.findMany({
    where: { userId },
    include: { album: true }
  });
  res.json(items);
};

const addToShoppingList = async (req, res) => {
  const userId = req.user.userId;
  const { albumId, quantity } = req.body;
  // Check if already exists
  const existing = await prisma.shoppingListItem.findFirst({ where: { userId, albumId } });
  if (existing) {
    // Update quantity
    const updated = await prisma.shoppingListItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity }
    });
    return res.json(updated);
  }
  const item = await prisma.shoppingListItem.create({
    data: { userId, albumId, quantity }
  });
  res.json(item);
};

const updateQuantity = async (req, res) => {
  const userId = req.user.userId;
  const id = parseInt(req.params.id, 10);
  const { quantity } = req.body;
  const item = await prisma.shoppingListItem.updateMany({
    where: { id, userId },
    data: { quantity }
  });
  res.json(item);
};

const removeFromShoppingList = async (req, res) => {
  const userId = req.user.userId;
  const id = parseInt(req.params.id, 10);
  await prisma.shoppingListItem.deleteMany({
    where: { id, userId }
  });
  res.json({ success: true });
};

export default { getShoppingList, addToShoppingList, updateQuantity, removeFromShoppingList };