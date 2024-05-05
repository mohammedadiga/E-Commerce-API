import express from 'express';

import { blockUser, deleteUser, getAllUser, getWashlist, getaUser, unblockUser, updateUser, userAddress } from '../controller/userController.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.get('/all-users',authMiddleware,isAdmin, getAllUser);
router.get('/get-user',authMiddleware, getaUser);
router.get('/wishlist',authMiddleware, getWashlist);

router.put('/edit-user', authMiddleware, updateUser);
router.put('/save-address', authMiddleware, userAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

router.delete('/:id',authMiddleware, isAdmin, deleteUser);


export default router;