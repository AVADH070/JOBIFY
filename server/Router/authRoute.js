import express from 'express'
const router = express.Router();
import { register, login, updateUser } from "../controller/authController.js";
import authonaticateUser from '../middleware/auth.js';

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/updateUser').patch(authonaticateUser, updateUser)


export default router;