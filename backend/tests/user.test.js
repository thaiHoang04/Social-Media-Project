const request = require('supertest');
const dotenv = require('dotenv');
const app = require('../server.js');

dotenv.config(); // Load environment variables

describe('User controller test', () => {
    // Test the getUserProfile function
    it('should return the profile of the friend of the current user', async () => {
        const res = await request(app).get(
            "/api/friends/66d6d7192ac356946767439e"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`);

        // Check if the function returns the correct response
        expect(res.body.friend).toStrictEqual({
            _id: '66d6d7192ac356946767439e',
            username: 'testUser',
            friends: [],
            groups: [],
            avatar: 'https://img.freepik.com/premium-vector/cute-boy-smiling-cartoon-kawaii-boy-illustration-boy-avatar-happy-kid_1001605-3447.jpg',
            email: 'testuser@gmail.com',
            isAdmin: false,
        });
    });

    it('should return 404 if user is not found', async () => {
        const res = await request(app).get(
            "/api/friends/66d6d7192ac3569467674eee"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`);

        // Verify the response
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Friend not found');
    });

    // Test the acceptFriendRequest function
    it('should accept the friend request', async () => {
        const res = await request(app).put(
            "/api/friends/accept/66d6d7192ac356946767439e/66d5725affacf17fd86eb3be"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`);

        // Check if the function returns the correct response
        expect(res.body.type).toBe('Friend Request Accepted');
    });

    it('should return 404 if user is not found', async () => {
        const res = await request(app).put(
            "/api/friends/accept/66d6d7192ac3569467674eee/66d6d7192ac356946767439e"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`);

        // Verify the response
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
    });

    // Test the unFriendByID function
    it('should remove the friend from the current user', async () => {

        const res = await request(app).put(
            "/api/friends/unfriend/66d70ed7fd4ce723e49b34ab"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`).send({
            userID: '66d6d7192ac356946767439e'
        });

        // Check if the function returns the correct response
        expect(res.body.message).toBe('Unfriend successfully');
    });

    it('should return 200 if server error occurs', async () => {
        const res = await request(app).put(
            "/api/friends/unfriend/66d6d7192ac3569467674eee"
        ).set('Authorization', `Bearer ${process.env.TEST_TOKEN}`).send({
            userID: '66d6d7192ac356946767439e'
        });

        // Verify the response
        expect(res.status).toBe(200);
    });
});
