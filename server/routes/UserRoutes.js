import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserData, storeRecentSearchCities } from '../controllers/userController.js';
const UserRouter = express.Router();

UserRouter.get('/', protect, getUserData);
UserRouter.post('/store-recent-search', protect, storeRecentSearchCities);

export default UserRouter;