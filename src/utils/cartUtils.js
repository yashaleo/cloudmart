const CART_KEY = "cloudmart_cart";

// Get all items from cart
export const getCartItems = () => {
  const cartItems = localStorage.getItem(CART_KEY);
  return cartItems ? JSON.parse(cartItems) : [];
};

// Save items to cart and dispatch cartUpdated event
export const saveCartItems = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cartUpdated"));
};

// Add a product to cart (or increment if already exists)
export const addToCart = (product) => {
  const cartItems = getCartItems();
  const existingItem = cartItems.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  saveCartItems(cartItems);
};

// Remove a product from cart by ID
export const removeFromCart = (productId) => {
  const cartItems = getCartItems();
  const updatedItems = cartItems.filter((item) => item.id !== productId);
  saveCartItems(updatedItems);
};

// Update quantity of a specific product (ignore if quantity < 1)
export const updateCartItemQuantity = (productId, quantity) => {
  if (quantity < 1) return;

  const cartItems = getCartItems();
  const item = cartItems.find((item) => item.id === productId);

  if (item) {
    item.quantity = quantity;
    saveCartItems(cartItems);
  }
};

// Get total item count in the cart
export const getCartItemsCount = () => {
  const cartItems = getCartItems();
  return cartItems.reduce((total, item) => total + item.quantity, 0);
};

// NEW: Get total price for all items in the cart
export const getCartTotal = () => {
  const cartItems = getCartItems();
  return cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};

// Clear the cart
export const clearCart = () => {
  saveCartItems([]);
  // If you prefer to fully remove the key:
  // localStorage.removeItem(CART_KEY);
};
