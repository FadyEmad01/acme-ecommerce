'use server';

import { Cart, Order, TAGS } from '@/lib/constants';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export async function createOrder(): Promise<Order | null> {
    const cartCookie = (await cookies()).get('cart');
    if (!cartCookie) return null;

    const cart: Cart = JSON.parse(cartCookie.value);

    if (cart.lines.length === 0) return null;

    const newOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber: Math.floor(Math.random() * 100000),
        customerUrl: '/order/status', // Mock
        lineItems: cart.lines,
        totalPrice: cart.cost.totalAmount,
        createdAt: new Date().toISOString()
    };

    console.log('Order created:', newOrder);

    // Clear cart
    (await cookies()).delete('cart');
    revalidateTag(TAGS.cart);

    return newOrder;
}
