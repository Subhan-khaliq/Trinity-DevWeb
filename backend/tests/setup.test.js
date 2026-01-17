import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

process.env.JWT_SECRET = 'test_secret';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret';

let mongod;

before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
});

after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongod) await mongod.stop();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});
