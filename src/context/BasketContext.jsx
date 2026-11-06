import React, { createContext, useContext, useReducer, useEffect } from 'react';

const BasketContext = createContext();

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Helper to calculate discounted price
const getDiscountedPrice = (price, discount) => {
  return discount ? price - (price * discount) / 100 : price;
};

const basketReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        // Store full product data (including discount) for each item
        updatedItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => {
        const discountedPrice = getDiscountedPrice(item.price, item.discount);
        return sum + discountedPrice * item.quantity;
      }, 0);
      return { items: updatedItems, totalItems, totalPrice };
    }
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => {
        const discountedPrice = getDiscountedPrice(item.price, item.discount);
        return sum + discountedPrice * item.quantity;
      }, 0);
      return { items: updatedItems, totalItems, totalPrice };
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => {
        const discountedPrice = getDiscountedPrice(item.price, item.discount);
        return sum + discountedPrice * item.quantity;
      }, 0);
      return { items: updatedItems, totalItems, totalPrice };
    }
    case 'CLEAR_BASKET':
      return initialState;
    default:
      return state;
  }
};

export const BasketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(basketReducer, initialState, () => {
    const localData = localStorage.getItem('basket');
    return localData ? JSON.parse(localData) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('basket', JSON.stringify(state));
  }, [state]);

  const addToBasket = (product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } });
  };

  const removeFromBasket = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearBasket = () => {
    dispatch({ type: 'CLEAR_BASKET' });
  };

  return (
    <BasketContext.Provider
      value={{
        basket: state,
        addToBasket,
        removeFromBasket,
        updateQuantity,
        clearBasket,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => useContext(BasketContext);