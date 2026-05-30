import React, { createContext, useContext, useState } from 'react';
import { ref, push } from 'firebase/database';
import { db } from '../helpers/Firebase';
import { Event } from './EventsContext';

export interface CartItem {
    event: Event;
    quantity: number;
}

export interface PurchasedTicket {
    id?: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventPlace: string;
    eventImage: string;
    eventCategory: string;
    quantity: number;
    totalPrice: number;
    purchasedAt: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (event: Event) => void;
    removeFromCart: (eventId: string) => void;
    increaseQuantity: (eventId: string) => void;
    decreaseQuantity: (eventId: string) => void;
    clearCart: () => void;
    total: number;
    purchaseTickets: (userId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addToCart: () => { },
    removeFromCart: () => { },
    increaseQuantity: () => { },
    decreaseQuantity: () => { },
    clearCart: () => { },
    total: 0,
    purchaseTickets: async () => { },
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

    const removeFromCart = (eventId: string) =>
        setItems((prev) => prev.filter((i) => i.event.id !== eventId));

    const increaseQuantity = (eventId: string) =>
        setItems((prev) =>
            prev.map((i) => (i.event.id === eventId ? { ...i, quantity: i.quantity + 1 } : i))
        );

    const decreaseQuantity = (eventId: string) =>
        setItems((prev) =>
            prev
                .map((i) => (i.event.id === eventId ? { ...i, quantity: i.quantity - 1 } : i))
                .filter((i) => i.quantity > 0)
        );

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, i) => sum + i.event.price * i.quantity, 0);

    // ✅ NUEVA FUNCIÓN: guarda cada item como ticket en Firebase
    const purchaseTickets = async (userId: string) => {
        const ticketsRef = ref(db, `tickets/${userId}`);
        const promises = items.map((item) =>
            push(ticketsRef, {
                eventId: item.event.id,
                eventTitle: item.event.title,
                eventDate: item.event.date,
                eventPlace: item.event.place,
                eventImage: item.event.image,
                eventCategory: item.event.category,
                quantity: item.quantity,
                totalPrice: item.event.price * item.quantity,
                purchasedAt: new Date().toISOString(),
            } as Omit<PurchasedTicket, 'id'>)
        );
        await Promise.all(promises);
        clearCart();
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                total,
                purchaseTickets,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);