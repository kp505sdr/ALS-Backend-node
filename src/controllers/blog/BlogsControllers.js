import Blog from "../../models/products/blogModels.js"
import User from "../../models/userModels.js";


// ---------------------create--blogs------------------------
export const createBlogs=async(req,res)=>{
    const {title,blogsDetails,image } = req.body;
    const userId=req.authData.userId; 
  try {
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Create a new blog instance using the Blog model
    const newBlog = new Blog({
      userId:userProfile._id,
      name:userProfile.name,
      profilepic:userProfile.profilepic,
      title,
      blogsDetails,
      image,
      timestamp: new Date()
    });

    // Save the new blog post to the database
    const savedBlog = await newBlog.save();

    res.status(201).json({ message: 'Blog post created successfully', blog: savedBlog });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


// -------------------update-blogs------------------------------------------------------------------
export const updateBlogs=async(req,res)=>{
    const { id } = req.params;
  const updateData = req.body;

  try {
    // Update the blog post by ID
    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog post by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// -------------------get all blogs-----------------------------------------------------------------------------------------

export const getAllBlogs=async(req,res)=>{
    try {
        // Find all blog posts in the database
        const blogs = await Blog.find();
    
        res.status(200).json(blogs);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }

    // -----------------self blog----------------only------------
    export const getAllSelfBlog=async(req,res)=>{
      const userId=req.authData.userId; 
      try {
        // Find all blog posts created by the logged-in user
        const blogs = await Blog.find({ userId: userId });
        
        res.status(200).json(blogs);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
    // ---------------------------self blog end---------------------------

// --------------------get single blogs-------------------------------------------------------------

export const getSingleBlogs=async(req,res)=>{
    const { id } = req.params;

  try {
    // Find the blog post by ID
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog post by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// -----------------delete-blogs-------------------------------------------

export const deleteBlogs=async(req,res)=>{
    const { id } = req.params;

  try {
    // Delete the blog post by ID
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post deleted successfully', blog: deletedBlog });
  } catch (error) {
    console.error('Error deleting blog post by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}