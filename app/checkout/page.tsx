'use client';

import { useCart } from '@/components/cart/cart-context';
import { createOrder } from './actions';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/layout/page-layout';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cart } = useCart();
    const [status, setStatus] = useState<'idle' | 'success' | 'processing'>('idle');

    async function handlePlaceOrder() {
        setStatus('processing');
        await createOrder();
        setStatus('success');
        // In a real app, we would redirect to a success page or update the cart context to reflect empty cart
        // Since useCart uses cookies, and we cleared cookies on server, the next fetch/refresh will show empty cart.
        // But we should probably refresh the router to update client state if needed.
        // For now, just showing success message.
        window.location.href = '/'; // Redirect to home or refresh to clear client context
    }

    if (status === 'success') {
        return (
            <PageLayout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                    <h1 className="text-2xl font-bold">Thank you for your order!</h1>
                    <p>Your order has been placed successfully.</p>
                    <Button asChild>
                        <Link href="/">Continue Shopping</Link>
                    </Button>
                </div>
            </PageLayout>
        );
    }

    if (!cart || cart.lines.length === 0) {
        return (
            <PageLayout>
                <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                    <h1 className="text-2xl font-bold">Your cart is empty</h1>
                    <Button asChild>
                        <Link href="/shop">Go to Shop</Link>
                    </Button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <div className="max-w-2xl mx-auto p-6 md:p-12">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="space-y-6">
                    {cart.lines.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-4">
                            <div>
                                <p className="font-semibold">{item.merchandise.title}</p>
                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-medium">
                                {formatPrice(item.cost.totalAmount.amount, item.cost.totalAmount.currencyCode)}
                            </p>
                        </div>
                    ))}

                    <div className="flex justify-between items-center text-xl font-bold pt-4 border-t">
                        <span>Total</span>
                        <span>{formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</span>
                    </div>

                    <Button
                        size="lg"
                        className="w-full mt-8"
                        onClick={handlePlaceOrder}
                        disabled={status === 'processing'}
                    >
                        {status === 'processing' ? 'Processing...' : 'Place Order'}
                    </Button>
                </div>
            </div>
        </PageLayout>
    );
}
