// src/redux/reducer.js
import { ADD_TO_CART, INCREMENT_QUANTITY, DECREMENT_QUANTITY } from './actions';

const initialState = {
    cart: [],
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const productInCart = state.cart.find(item => item.id === action.payload.id);
            if (productInCart) {
                return {
                    ...state,
                    cart: state.cart.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            } else {
                return {
                    ...state,
                    cart: [...state.cart, { ...action.payload, quantity: 1 }],
                };
            }
        case INCREMENT_QUANTITY:
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            };
        case DECREMENT_QUANTITY:
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                ),
            };
        default:
            return state;
    }
};

export default cartReducer;
