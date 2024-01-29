import { mongoose } from "mongoose";
import Blog from "../model/Blog.js"
import User from "../model/User.js";

export const getAllBlogs = async(req,res,next)=>{
    let blogs;
    try{
        blogs = await Blog.find();
    }catch(err){
        console.log(err);
    }
    if(!blogs){
        return res.status(404).json({message:"No blog found"});
    }
    return res.status(200).json({blogs});
}

export const postABlog = async(req,res,next)=>{
    const {title,description,image,userid} = req.body;
    let existingUser;
    try {
        existingUser = await User.findById(userid);
    } catch (error) {
        console.log(error)
    }
    if(!existingUser){
        return res.status(404).json({message:"User not found"});
    }
    const newBlog = new Blog({
        title,
        description,
        image,
        userid
    });
    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save(session);
        existingUser.blogs.push(newBlog);
        await existingUser.save({session});
        await session.commitTransaction();
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Error creating blog"});
    }
    return res.status(201).json({message:"Blog created"});
}

export const updateABlog = async(req,res,next)=>{
    const blogId = req.params.id;
    const {title,description} = req.body;
    let blog;
    try {
        blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({message:"No blog found"});
        }
        blog.title = title;
        blog.description = description;
        await blog.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({message:"Error updating blog"});
    }
    return res.status(200).json({blog});
}

export const getBlogById = async(req,res,next)=>{
    const blogId = req.params.id;
    let blog;
    try{
         blog = await Blog.findById(blogId);
    }catch(err){
        console.log(err);
        return res.status(404).json({message:"No blog found"});
    }
    return res.status(200).json({blog});
}
export const deleteBlogById = async (req, res, next) => {
    const blogId = req.params.id;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "No blog found" });
        }

        const userId = blog.userid;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the blogId exists in the user's blogs array before attempting to pull
        const blogIndex = user.blogs.indexOf(blogId);
        if (blogIndex !== -1) {
            user.blogs.splice(blogIndex, 1); // Remove the blog reference from the user's blogs array
            await user.save(); // Save the updated user
        } else {
            return res.status(404).json({ message: "Blog not associated with user" });
        }

        await blog.deleteOne(); // Delete the blog

        return res.status(200).json({ message: "Blog deleted" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Error deleting blog" });
    }
};