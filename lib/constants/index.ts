export * from './mock-data';
import { products, collections, Product, Collection, Money } from './mock-data';
import { NavItem } from '../types';

export type { Product, Collection };

export type CartProduct = Product;

export type SelectedOptions = {
    name: string;
    value: string;
}[];

export type Cart = {
    id: string;
    checkoutUrl: string;
    cost: {
        subtotalAmount: Money;
        totalAmount: Money;
        totalTaxAmount: Money;
        shippingAmount?: Money;
    };
    totalQuantity: number;
    lines: CartItem[];
};

export type CartItem = {
    id: string;
    quantity: number;
    cost: {
        totalAmount: Money;
    };
    merchandise: {
        id: string;
        title: string;
        selectedOptions: SelectedOptions;
        product: Product;
    };
};

export const TAGS = {
    mode: 'mode',
    collections: 'collections',
    products: 'products',
    collectionProducts: 'collection-products',
    cart: 'cart',
};

export const CONTACT_LINKS: NavItem[] = [
    {
        label: '37°47\'33.4"N 122°24\'18.6"W',
        href: 'https://maps.app.goo.gl/MnpbPDEHxoDydc9M9',
    },
    {
        label: '(269) 682-1402',
        href: 'https://joyco.studio/showcase',
    },
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/joyco.studio/',
    },
];

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/graphql';
export const isDevelopment = process.env.NODE_ENV === 'development';

export const storeCatalog = {
    title: 'ACME Store',
    rootCategoryId: 'all'
};

export const sortOptions = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
];

export const COLOR_MAP: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#eab308',
    orange: '#f97316',
    purple: '#a855f7',
    pink: '#ec4899',
    black: '#000000',
    white: '#ffffff',
    gray: '#6b7280',
    grey: '#6b7280',
    brown: '#92400e',
    navy: '#1e3a8a',
    teal: '#14b8a6',
    cyan: '#06b6d4',
    indigo: '#6366f1',
    violet: '#8b5cf6',
    lime: '#84cc16',
    emerald: '#10b981',
    rose: '#f43f5e',
    fuchsia: '#d946ef',
    slate: '#64748b',
    neutral: '#737373',
    stone: '#78716c',
    zinc: '#71717a',
    'light-blue': '#38bdf8',
    'dark-blue': '#1e40af',
    'light-green': '#4ade80',
    'dark-green': '#232E23',
    'light-gray': '#d1d5db',
    'dark-gray': '#374151',
    'light-grey': '#d1d5db',
    'dark-grey': '#374151',
    'dark-brown': '#6b4a1b',
    beige: '#f5f5dc',
    maroon: '#800000',
    olive: '#808000',
    aqua: '#00ffff',
    silver: '#c0c0c0',
    gold: '#ffd700',
    coral: '#ff7f50',
    salmon: '#fa8072',
    khaki: '#f0e68c',
    sand: '#e7d3b7',
    plum: '#dda0dd',
    tan: '#d2b48c',
    crimson: '#dc143c',
    turquoise: '#40e0d0',
    lavender: '#e6e6fa',
    ivory: '#fffff0',
    mint: '#98fb98',
    peach: '#ffcba4',
    pistachio: '#93c572',
    cream: '#edd0ae',
    'army-green': '#4b5320',
    'navy-blue': '#000080',
    wood: '#8d6e63',
};

// Utils
export function getShopifyProductId(id: string) {
    return id;
}

// Data access
export async function getProducts({ query, reverse, sortKey, limit }: { query?: string; reverse?: boolean; sortKey?: string; limit?: number }): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    let filteredProducts = products;

    if (query) {
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    if (sortKey === 'price-asc') {
        filteredProducts.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    } else if (sortKey === 'price-desc') {
        filteredProducts.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    }

    if (reverse) {
        filteredProducts.reverse();
    }

    if (limit) {
        return filteredProducts.slice(0, limit);
    }

    return filteredProducts;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return products.find(product => product.handle === handle);
}

export async function getCollections(): Promise<Collection[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return collections;
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return collections.find(collection => collection.handle === handle);
}

export async function getCollectionProducts({ collection, reverse, sortKey, query }: { collection: string; reverse?: boolean; sortKey?: string; query?: string }): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));

    let filteredProducts = products;

    if (query) {
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    if (collection !== 'all') {
        if (collection === 'clothing') {
            filteredProducts = filteredProducts.filter(p => p.tags.includes('Clothing'));
        } else if (collection === 'accessories') {
            filteredProducts = filteredProducts.filter(p => p.tags.includes('Accessories'));
        } else {
            const capitalized = collection.charAt(0).toUpperCase() + collection.slice(1);
            const tagMatches = filteredProducts.filter(p => p.tags.includes(capitalized));
            if (tagMatches.length > 0) {
                filteredProducts = tagMatches;
            }
        }
    }

    if (sortKey === 'price-asc') {
        filteredProducts.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    } else if (sortKey === 'price-desc') {
        filteredProducts.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
    }

    if (reverse) {
        filteredProducts.reverse();
    }

    return filteredProducts;
}
