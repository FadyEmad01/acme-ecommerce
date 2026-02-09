'use server';

import { TAGS, Cart, CartItem, Product, ProductVariant } from '@/lib/constants';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { formatPrice } from '@/lib/utils'; // Ensure this is available

// Helper to get cart from cookies
async function getCartFromCookies(): Promise<Cart | null> {
  const cartCookie = (await cookies()).get('cart');
  if (!cartCookie) return null;
  try {
    return JSON.parse(cartCookie.value);
  } catch (e) {
    return null;
  }
}

// Helper to save cart to cookies
async function saveCartToCookies(cart: Cart) {
  (await cookies()).set('cart', JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

function calculateCartTotals(lines: CartItem[]): Cart['cost'] {
  const totalAmountValue = lines.reduce((sum, item) => sum + (parseFloat(item.cost.totalAmount.amount) || 0), 0);
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode || 'USD';

  return {
    subtotalAmount: { amount: totalAmountValue.toFixed(2), currencyCode },
    totalAmount: { amount: totalAmountValue.toFixed(2), currencyCode },
    totalTaxAmount: { amount: '0.00', currencyCode },
    shippingAmount: { amount: '0.00', currencyCode }
  };
}

export async function addItem(variantId: string | undefined): Promise<Cart | null> {
  if (!variantId) return null;

  let cart = await getCartFromCookies();

  // If no cart, create one (we need the product details, but addItem only receives variantId... 
  // In the real app, we might need to fetch product by variantId from our constants.
  // BUT, the `addItem` payload in `cart-context` passes `variant` and `product`.
  // However, the SERVER action `addItem` signature in `actions.ts` (original) only took `variantId`.
  // The client side optimistic update used full objects.
  // To verify checks, we need to find the variant in our mock data.

  // Implemenation Note: In a real mock, we should lookup the variant from `lib/constants`.
  // But `lib/constants` only exports `products` array. We need to find the product containing the variant.

  const { products } = await import('@/lib/constants');
  let product: Product | undefined;
  let variant: ProductVariant | undefined;

  for (const p of products) {
    const v = p.variants.find(v => v.id === variantId);
    if (v) {
      product = p;
      variant = v;
      break;
    }
  }

  if (!product || !variant) {
    console.error('Product or variant not found for id:', variantId);
    return cart;
  }

  if (!cart) {
    cart = {
      id: `cart-${Date.now()}`,
      checkoutUrl: '/checkout', // Mock URL
      cost: {
        subtotalAmount: { amount: '0', currencyCode: 'USD' },
        totalAmount: { amount: '0', currencyCode: 'USD' },
        totalTaxAmount: { amount: '0', currencyCode: 'USD' }
      },
      totalQuantity: 0,
      lines: []
    };
  }

  const existingLineIndex = cart.lines.findIndex(l => l.merchandise.id === variantId);

  if (existingLineIndex > -1) {
    const line = cart.lines[existingLineIndex];
    const newQuantity = line.quantity + 1;
    const amount = (parseFloat(variant.price.amount) * newQuantity).toFixed(2);

    cart.lines[existingLineIndex] = {
      ...line,
      quantity: newQuantity,
      cost: {
        totalAmount: { amount, currencyCode: variant.price.currencyCode }
      }
    };
  } else {
    const amount = variant.price.amount; // verified it's a string '50.00'
    cart.lines.push({
      id: `line-${Date.now()}`,
      quantity: 1,
      cost: {
        totalAmount: { amount, currencyCode: variant.price.currencyCode }
      },
      merchandise: {
        id: variant!.id,
        title: variant!.title,
        selectedOptions: variant!.selectedOptions,
        product: product!
      }
    });
  }

  cart.cost = calculateCartTotals(cart.lines);
  cart.totalQuantity = cart.lines.reduce((sum, line) => sum + line.quantity, 0);

  await saveCartToCookies(cart);
  revalidateTag(TAGS.cart);
  return cart;
}

export async function updateItem({ lineId, quantity }: { lineId: string; quantity: number }): Promise<Cart | null> {
  let cart = await getCartFromCookies();
  if (!cart) return null;

  if (quantity <= 0) {
    cart.lines = cart.lines.filter(l => l.id !== lineId && l.merchandise.id !== lineId); // Check both for safety (mock ids might vary)
  } else {
    const lineIndex = cart.lines.findIndex(l => l.id === lineId || l.merchandise.id === lineId);
    if (lineIndex > -1) {
      const line = cart.lines[lineIndex];
      // We need unit price. 
      // line.cost.totalAmount.amount / line.quantity
      const unitPrice = parseFloat(line.cost.totalAmount.amount) / line.quantity;
      const newTotal = (unitPrice * quantity).toFixed(2);

      cart.lines[lineIndex] = {
        ...line,
        quantity,
        cost: {
          totalAmount: { ...line.cost.totalAmount, amount: newTotal }
        }
      };
    }
  }

  cart.cost = calculateCartTotals(cart.lines);
  cart.totalQuantity = cart.lines.reduce((sum, line) => sum + line.quantity, 0);

  await saveCartToCookies(cart);
  revalidateTag(TAGS.cart);
  return cart;
}

export async function getCart(): Promise<Cart | null> {
  return getCartFromCookies();
}
