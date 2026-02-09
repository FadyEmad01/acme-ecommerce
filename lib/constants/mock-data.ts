export type Product = {
    id: string;
    handle: string;
    availableForSale: boolean;
    title: string;
    description: string;
    descriptionHtml: string;
    options: ProductOption[];
    priceRange: {
        maxVariantPrice: Money;
        minVariantPrice: Money;
    };
    compareAtPrice?: Money;
    variants: ProductVariant[];
    featuredImage: Image;
    images: Image[];
    seo: SEO;
    tags: string[];
    updatedAt: string;
    categoryId?: string;
    currencyCode?: string;
};

export type ProductOption = {
    id: string;
    name: string;
    values: {
        name: string;
        id: string;
    }[];
};

export type ProductVariant = {
    id: string;
    title: string;
    availableForSale: boolean;
    selectedOptions: {
        name: string;
        value: string;
    }[];
    price: Money;
};

export type Money = {
    amount: string;
    currencyCode: string;
};

export type Image = {
    url: string;
    altText: string;
    width: number;
    height: number;
    selectedOptions?: {
        name: string;
        value: string;
    }[];
    thumbhash?: string;
};

export type SEO = {
    title: string;
    description: string;
};

export type Collection = {
    handle: string;
    title: string;
    description: string;
    seo: SEO;
    updatedAt: string;
    path: string;
    parentCategoryTree?: { id: string; name: string }[];
};

export type Order = {
    id: string;
    orderNumber: number;
    customerUrl: string;
    lineItems: any[];
    totalPrice: Money;
    createdAt: string;
};

const products: Product[] = [
    {
        id: '1',
        handle: 'black-hoodie',
        availableForSale: true,
        title: 'Acme Hoodie',
        description: 'A comfortable, warm hoodie for everyday wear.',
        descriptionHtml: '<p>A comfortable, warm hoodie for everyday wear.</p>',
        options: [
            {
                id: 'size',
                name: 'Size',
                values: [
                    { name: 'S', id: 's' },
                    { name: 'M', id: 'm' },
                    { name: 'L', id: 'l' },
                    { name: 'XL', id: 'xl' }
                ]
            },
            {
                id: 'color',
                name: 'Color',
                values: [
                    { name: 'Black', id: 'black' },
                    { name: 'Gray', id: 'gray' }
                ]
            }
        ],
        priceRange: {
            maxVariantPrice: { amount: '50.00', currencyCode: 'USD' },
            minVariantPrice: { amount: '50.00', currencyCode: 'USD' }
        },
        variants: [
            {
                id: '1-1',
                title: 'Small / Black',
                availableForSale: true,
                selectedOptions: [{ name: 'Size', value: 'S' }, { name: 'Color', value: 'Black' }],
                price: { amount: '50.00', currencyCode: 'USD' }
            },
            {
                id: '1-2',
                title: 'Medium / Black',
                availableForSale: true,
                selectedOptions: [{ name: 'Size', value: 'M' }, { name: 'Color', value: 'Black' }],
                price: { amount: '50.00', currencyCode: 'USD' }
            }
        ],
        featuredImage: {
            url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
            altText: 'Acme Hoodie',
            width: 800,
            height: 800
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
                altText: 'Acme Hoodie',
                width: 800,
                height: 800
            }
        ],
        seo: {
            title: 'Acme Hoodie',
            description: 'A comfortable, warm hoodie for everyday wear.'
        },
        tags: ['Hoodie', 'Clothing'],
        updatedAt: new Date().toISOString(),
        currencyCode: 'USD'
    },
    {
        id: '2',
        handle: 'acme-t-shirt',
        availableForSale: true,
        title: 'Acme T-Shirt',
        description: 'A classic t-shirt for any occasion.',
        descriptionHtml: '<p>A classic t-shirt for any occasion.</p>',
        options: [
            {
                id: 'size',
                name: 'Size',
                values: [
                    { name: 'S', id: 's' },
                    { name: 'M', id: 'm' },
                    { name: 'L', id: 'l' },
                    { name: 'XL', id: 'xl' }
                ]
            },
            {
                id: 'color',
                name: 'Color',
                values: [
                    { name: 'White', id: 'white' },
                    { name: 'Gray', id: 'gray' }
                ]
            }
        ],
        priceRange: {
            maxVariantPrice: { amount: '25.00', currencyCode: 'USD' },
            minVariantPrice: { amount: '25.00', currencyCode: 'USD' }
        },
        variants: [
            {
                id: '2-1',
                title: 'Small',
                availableForSale: true,
                selectedOptions: [{ name: 'Size', value: 's' }, { name: 'Color', value: 'White' }],
                price: { amount: '25.00', currencyCode: 'USD' }
            }
        ],
        featuredImage: {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
            altText: 'Acme T-Shirt',
            width: 800,
            height: 800
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
                altText: 'Acme T-Shirt',
                width: 800,
                height: 800
            }
        ],
        seo: {
            title: 'Acme T-Shirt',
            description: 'A classic t-shirt for any occasion.'
        },
        tags: ['T-Shirt', 'Clothing'],
        updatedAt: new Date().toISOString(),
        currencyCode: 'USD'
    },
    {
        id: '3',
        handle: 'acme-mug',
        availableForSale: true,
        title: 'Acme Mug',
        description: 'A sturdy mug for your morning coffee.',
        descriptionHtml: '<p>A sturdy mug for your morning coffee.</p>',
        options: [],
        priceRange: {
            maxVariantPrice: { amount: '15.00', currencyCode: 'USD' },
            minVariantPrice: { amount: '15.00', currencyCode: 'USD' }
        },
        variants: [
            {
                id: '3-1',
                title: 'Default Title',
                availableForSale: true,
                selectedOptions: [],
                price: { amount: '15.00', currencyCode: 'USD' }
            }
        ],
        featuredImage: {
            url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
            altText: 'Acme Mug',
            width: 800,
            height: 800
        },
        images: [
            {
                url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80',
                altText: 'Acme Mug',
                width: 800,
                height: 800
            }
        ],
        seo: {
            title: 'Acme Mug',
            description: 'A sturdy mug for your morning coffee.'
        },
        tags: ['Mug', 'Accessories'],
        updatedAt: new Date().toISOString(),
        currencyCode: 'USD'
    }
];

const collections: Collection[] = [
    {
        handle: 'all',
        title: 'All Products',
        description: 'All of our products.',
        seo: {
            title: 'All Products',
            description: 'All of our products.'
        },
        updatedAt: new Date().toISOString(),
        path: '/search/all',
        parentCategoryTree: []
    },
    {
        handle: 'clothing',
        title: 'Clothing',
        description: 'Our clothing collection.',
        seo: {
            title: 'Clothing',
            description: 'Our clothing collection.'
        },
        updatedAt: new Date().toISOString(),
        path: '/search/clothing',
        parentCategoryTree: [{ id: 'all', name: 'All Products' }]
    },
    {
        handle: 'accessories',
        title: 'Accessories',
        description: 'Our accessories collection.',
        seo: {
            title: 'Accessories',
            description: 'Our accessories collection.'
        },
        updatedAt: new Date().toISOString(),
        path: '/search/accessories',
        parentCategoryTree: [{ id: 'all', name: 'All Products' }]
    }
];

export const orders: Order[] = [];

export { products, collections };
