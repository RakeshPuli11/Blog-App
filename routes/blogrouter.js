import express from 'express';
import  {getAllBlogs,postABlog,updateABlog,getBlogById,deleteBlogById}  from '../controllers/blog-controller.js';
const brouter = express.Router();


brouter.get('/allblogs',getAllBlogs);
brouter.post('/postablog',postABlog);
brouter.put('/updateablog/:id',updateABlog);
brouter.get('/getblogbyid/:id',getBlogById);
brouter.delete('/deleteblogbyid/:id',deleteBlogById);

export default brouter;