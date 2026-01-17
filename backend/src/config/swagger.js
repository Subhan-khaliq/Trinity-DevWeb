import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Trinity Part Two API',
            version: '1.0.0',
            description: 'Comprehensive API documentation for the Trinity Store e-commerce platform. Includes authentication, product catalog, order management, and analytics.',
            contact: {
                name: 'API Support',
                email: 'support@trinity.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        firstName: { type: 'string', example: 'John' },
                        lastName: { type: 'string', example: 'Doe' },
                        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                        role: { type: 'string', enum: ['customer', 'admin'], example: 'customer' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Product: {
                    type: 'object',
                    required: ['name', 'price'],
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
                        name: { type: 'string', example: 'Wireless Headphones' },
                        brand: { type: 'string', example: 'SoundMaster' },
                        category: { type: 'string', example: 'Electronics' },
                        price: { type: 'number', example: 99.99 },
                        availableQuantity: { type: 'integer', example: 50 },
                        picture: { type: 'string', example: 'https://images.unsplash.com/photo...' },
                        barcode: { type: 'string', example: '123456789' }
                    }
                },
                Invoice: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109cc' },
                        userId: { $ref: '#/components/schemas/User' },
                        totalAmount: { type: 'number', example: 149.97 },
                        paymentMethod: { type: 'string', enum: ['card', 'cash'], example: 'card' },
                        paymentStatus: { type: 'string', enum: ['paid', 'pending'], example: 'paid' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                InvoiceItem: {
                    type: 'object',
                    properties: {
                        productId: { $ref: '#/components/schemas/Product' },
                        quantity: { type: 'integer', example: 2 },
                        priceAtPurchase: { type: 'number', example: 49.99 },
                        subtotal: { type: 'number', example: 99.98 }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'An error occurred' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
