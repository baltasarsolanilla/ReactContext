import { createContext, useState, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products.js";

// We wanna add an initial state for auto-completion suggestions
export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

export const SHOPPING_CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  UPDATE_ITEM_QUANTITY: "UPDATE_ITEM_QUANTITY",
};

const shoppingCartReducer = (state, action) => {
  function handleAddItemToCart({ id }) {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === id
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find((product) => product.id === id);
      updatedItems.push({
        id: id,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  function handleUpdateCartItemQuantity({ productId, amount }) {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  switch (action.type) {
    case SHOPPING_CART_ACTIONS.ADD_ITEM:
      return handleAddItemToCart(action.payload);
    case SHOPPING_CART_ACTIONS.UPDATE_ITEM_QUANTITY:
      return handleUpdateCartItemQuantity(action.payload);
    default:
      return state;
  }
};

export const CartContextProvider = ({ children }) => {
  const [shoppingCartState, dispatch] = useReducer(shoppingCartReducer, {
    items: [],
  });

  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: (id) =>
      dispatch({ type: SHOPPING_CART_ACTIONS.ADD_ITEM, payload: { id } }),
    updateItemQuantity: (productId, amount) =>
      dispatch({
        type: SHOPPING_CART_ACTIONS.UPDATE_ITEM_QUANTITY,
        payload: { productId, amount },
      }),
  };

  return <CartContext value={ctxValue}>{children}</CartContext>;
};
