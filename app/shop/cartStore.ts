let cartItems: any[] = [];

const getCartItems = () => cartItems;

const addItemToCart = (item: { id: any; title: string; price: string; color: any; size: any; quantity: any; imageUrl: string; }) => {
  const uniqueId = `${item.id}-${item.color || ''}-${item.size || ''}`; // Generate a unique ID based on item attributes
  const existingItem = cartItems.find((cartItem) => cartItem.uniqueId === uniqueId);

  if (existingItem) {
    existingItem.quantity += item.quantity || 1; // Increment quantity if the same unique item exists
  } else {
    cartItems.push({ ...item, uniqueId }); // Add new item with uniqueId
  }
};

const setCartItems = (items: any[]) => {
  cartItems = items;
};

export default { getCartItems, addItemToCart, setCartItems };
