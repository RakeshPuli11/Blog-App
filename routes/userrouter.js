import express from 'express';
import  {getAllUsers,signUp,login,getUserById}  from '../controllers/user-controller.js';
const router = express.Router();


router.get('/',(req,res) => {res.send("hi bro")})
router.get('/allusers',getAllUsers);
router.post("/signup",signUp);
router.post("/login",login)
router.get('/user/:id',getUserById);

export default router;