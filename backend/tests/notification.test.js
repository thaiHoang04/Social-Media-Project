const request = require('supertest');
const dotenv = require('dotenv');
const app = require('../server');
const mongoose = require("mongoose");

dotenv.config(); // Load environment variables

let notification;

beforeAll(async () => {
    if (mongoose.connect.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => console.log('MongoDB connected'))
        console.log('MongoDB connection opened');
    }
})

describe('Notification Controller Test', () => {
    // Test the createNotification function
    it('should create a notification', async () => {
        const res = await request(app).post(
            "/api/notifications/create/66d6d7192ac356946767439e"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`).send({
            senderID: '66d5725affacf17fd86eb3be',
            type: 'Friend Request',
            message: 'You have a new friend request'
        });

        // Check if the function returns the correct response
        expect(res.body.senderID).toBe('66d5725affacf17fd86eb3be');
        expect(res.body.receiverID).toBe('66d6d7192ac356946767439e');
        expect(res.body.message).toBe('You have a new friend request');
        expect(res.body.type).toBe('Friend Request');

        notification = res.body;
    });

    it('should return 500 if server error', async () => {
        const res = await request(app).post(
            "/api/notifications/create/66d6d7192ac356946767439e"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`).send({
            senderID: '66d6d7192ac356946767439e',
            message: 'You have a new friend request'
        });

        // Verify the response
        expect(res.status).toBe(500);
        expect(res.body.message).toBe('Server error');
    });


    it('should return 200 if server error', async () => {
        const res = await request(app).get(
            "/api/notifications/get/66d6d7192ac356946767ee9e"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`);

        // Verify the response
        expect(res.status).toBe(200);
    });

    // Test the getNotificationByUserIDAndSenderID function
    it('should return the notification', async () => {
        const res = await request(app).get(
            "/api/notifications/check/66d5725affacf17fd86eb3be/66d6d7192ac356946767439e"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`);

        // Check if the function returns the correct response
        expect(res.body).toStrictEqual([
            notification,
        ]);
    });

    it('should return 200 if server error', async () => {
        const res = await request(app).get(
            "/api/notifications/check/66d5725affacf17fd86eeebe/66d6d7192ac356946767439e"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`);

        // Verify the response
        expect(res.status).toBe(200);
    });

    it('should return 404 if server error', async () => {
        const res = await request(app).delete(
            "/api/notifications/delete/66d6d7192ac356946767439e"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`);

        // Verify the response
        expect(res.status).toBe(404);
    });

    // Test the getNotificationsByUserID function
    it('should return the notifications of the user', async () => {
        const res = await request(app).get(
            "/api/notifications/get/66d6d7192ac356946767439e"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`);

        const data = res.body[0];


        // Check if the function returns the correct response
        expect(data._id).toStrictEqual(notification._id);
        expect(data.senderID._id).toStrictEqual(notification.senderID);
        expect(data.receiverID).toStrictEqual(notification.receiverID);
        expect(data.message).toStrictEqual(notification.message);
        expect(data.type).toStrictEqual(notification.type);
    });
});

afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
    }
});
