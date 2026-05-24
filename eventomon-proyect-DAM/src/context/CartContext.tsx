import React, { createContext, useContext, useState } from 'react';
import { Event } from './EventsContext';

export interface CartItem {
    event: Event;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (event: Event) => void;
    removeFromCart: (eventId: string) => void;
    increaseQuantity: (eventId: string) => void;
    decreaseQuantity: (eventId: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addToCart: () => { },
    removeFromCart: () => { },
    increaseQuantity: () => { },
    decreaseQuantity: () => { },
    clearCart: () => { },
    total: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (event: Event) => {
        setItems((prev) => {
            const exists = prev.find((i) => i.event.id === event.id);
            if (exists) {
                return prev.map((i) =>
                    i.event.id === event.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { event, quantity: 1 }];
        });
    };

    const removeFromCart = (eventId: string) => {
        setItems((prev) => prev.filter((i) => i.event.id !== eventId));
    };

    const increaseQuantity = (eventId: string) => {
        setItems((prev) =>
            prev.map((i) =>
                i.event.id === eventId ? { ...i, quantity: i.quantity + 1 } : i
            )
        );
    };

    const decreaseQuantity = (eventId: string) => {
        setItems((prev) =>
            prev
                .map((i) =>
                    i.event.id === eventId ? { ...i, quantity: i.quantity - 1 } : i
                )
                .filter((i) => i.quantity > 0)
        );
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, i) => sum + i.event.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);