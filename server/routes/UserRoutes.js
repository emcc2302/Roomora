import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getUserData, storeRecentSearchCities } from '../controllers/userController.js';
const UserRouter = express.Router();

UserRouter.get('/', protect, getUserData);
UserRouter.post('/recent-search', protect, storeRecentSearchCities);

export default UserRouter;