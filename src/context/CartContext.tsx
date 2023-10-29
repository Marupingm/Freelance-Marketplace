"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface CartItem {
  _id: string;
  title: string;
  price: number;
  fileUrl: string;
  sellerId: {
    _id: string;
    name: string;
    level: string;
  };
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case 'ADD_ITEM':
      // Check if item already exists
      if (state.items.some(item => item._id === action.payload._id)) {
        return state;
      }
      newState = {
        items: [...state.items, action.payload],
        total: state.total + action.payload.price,
      };
      break;

    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item._id === action.payload);
      newState = {
        items: state.items.filter(item => item._id !== action.payload),
        total: state.total - (itemToRemove?.price || 0),
      };
      break;

    case 'CLEAR_CART':
      newState = {
        items: [],
        total: 0,
      };
      break;

    case 'LOAD_CART':
      newState = action.payload;
      break;

    default:
      return state;
  }

  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(newState));
  return newState;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Wrap dispatch to handle notifications
  const dispatchWithNotification = (action: CartAction) => {
    dispatch(action);
    
    // Handle notifications after state update
    switch (action.type) {
      case 'ADD_ITEM':
        if (!state.items.some(item => item._id === action.payload._id)) {
          toast.success('Added to cart');
        } else {
          toast.error('Item already in cart');
        }
        break;
      case 'REMOVE_ITEM':
        toast.success('Removed from cart');
        break;
      case 'CLEAR_CART':
        toast.success('Cart cleared');
        break;
    }
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch: dispatchWithNotification }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} //  
//  
