import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import Product from '../src/models/Product.js';

describe('Product Controller', () => {
    beforeEach(async () => {
        await Product.create([
            { name: 'Product 1', price: 10, barcode: '1', availableQuantity: 50 },
            { name: 'Product 2', price: 20, barcode: '2', availableQuantity: 30 },
            { name: 'Product 3', price: 30, barcode: '3', availableQuantity: 10 },
            { name: 'Product 4', price: 40, barcode: '4', availableQuantity: 5 },
            { name: 'Product 5', price: 50, barcode: '5', availableQuantity: 100 }
        ]);
    });

    describe('GET /api/products', () => {
        it('should fetch all products if no pagination is provided', async () => {
            const res = await request(app).get('/api/products');

            expect(res.status).to.equal(200);
            expect(res.body.products).to.have.lengthOf(5);
            expect(res.body.totalPages).to.equal(1);
        });

        it('should respect limits for pagination', async () => {
            const res = await request(app).get('/api/products?page=1&limit=2');

            expect(res.status).to.equal(200);
            expect(res.body.products).to.have.lengthOf(2);
            expect(res.body.totalPages).to.equal(3);
        });
    });
});
