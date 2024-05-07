import Job from "../../models/products/jobModels.js"; //job schema
import User from "../../models/userModels.js";

export const jobCreate = async (req, res) => {

    try {
      const userId=req.authData.userId;
        // Find user profile
        const userProfile = await User.findById(userId);

        // Check if user exists
        if (!userProfile) {
            return res.status(404).json({ error: "User not found" });
        }

        // Set data with createdBy
          const createdBy = {
            userId: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            profilepic:userProfile.profilepic,
            socialMedia:userProfile.socialMedia,
            mobile:userProfile.mobile
        };

        // Create job
        const jobData = { ...req.body, createdBy };
        const jobAd = await Job.create(jobData);
        res.status(201).json(jobAd);
    } catch (err) {
        // Handle errors
        console.error("Error creating job:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ----------------------jobUpade-------------------------------------------------------------------------------------

export const jobUpade=async(req,res)=>{
    

try {
    
  const userId=req.authData.userId;  // Assuming userId is provided in the request body

    const jobAd = await Job.findById(req.params.id).populate('createdBy');
    if (!jobAd) {
      return res.status(404).json({ error: 'Job advertisement not found' });
    }

    // Check if the authenticated user is the creator of the job advertisement

    if (!jobAd.createdBy || jobAd.createdBy[0].userId.toString() !== userId) {
      return res.status(403).json({ error: 'You are not authorized to update this job advertisement' });
    }

    // Update the job advertisement
    const updatedJobAd = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJobAd);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
    
}

// -----------------------------------get all job-----------------------------------------------------------------------------

export const getAllJob=async(req,res)=>{
    try {
        const jobAds = await Job.find();
        res.json(jobAds);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    
    
}


//-------------------------------get---single--------job----------------------------------------------------------------------
export const getSingleJob=async(req,res)=>{
    try {
        const jobAds = await Job.findById(req.params.id);
        if(!jobAds){
            return res.json({message:"Job ads not Found"})
        }
        res.json(jobAds);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    
    
}
// -----------------------------jobdelete------------------------------------------------------------------------------------


export const jobdelete=async(req,res)=>{
    try {

      const userId=req.authData.userId; // Assuming userId is provided in the request body
    
        const jobAd = await Job.findById(req.params.id).populate('createdBy');
        if (!jobAd) {
          return res.status(404).json({ error: 'Job advertisement not found' });
        }
    
        // Check if the authenticated user is the creator of the job advertisement
    
        if (!jobAd.createdBy || jobAd.createdBy[0].userId.toString() !== userId) {
          return res.status(403).json({ error: 'You are not authorized to Delete this job advertisement' });
        }
    
       await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job advertisement deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}





// -------------------------Like--function------------------------------------------------------------------------------

export const Likes=async(req,res)=>{
    try {
       const userId=req.authData.userId; 
        const jobId = req.params.id;

        // Retrieve the user profile
        const userProfile = await User.findById(userId);
         
        // Check if the job advertisement exists
        const jobAd = await Job.findById(jobId);
        if (!jobAd) {
            return res.status(404).json({ error: 'Job advertisement not found' });
        }
        
        // Check if the user has already liked the job advertisement
        const alreadyLikedIndex = jobAd.likes.findIndex(like => like.userId.equals(userId));
        if (alreadyLikedIndex !== -1) {
            // User has already liked the job advertisement, so remove the like
            jobAd.likes.splice(alreadyLikedIndex, 1);
        } else {
            // User hasn't liked the job advertisement, so add the like
            const like = { userId: userId , name: userProfile.name, email: userProfile.email, profilepic: userProfile.profilepic };
            jobAd.likes.push(like);
        }

        // Save the updated job advertisement
        const updatedJobAd = await jobAd.save();
        
        // Send the updated job advertisement as response
        res.json(updatedJobAd);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}



// ---------------------comment---function------------------------------------------------------------------------------

export const Comments=async(req,res)=>{
  const userId=req.authData.userId; 
    try {
        //geting data from userschema
        const userProfile=await User.findById(userId)
        const addcomment=req.body.comment
    //set all data to be send with comment
        const comment = { userId: req.body.userId, content: addcomment,name:userProfile.name,email:userProfile.email,profilepic:userProfile.profilepic}; // Change req.user.id to your method of accessing the user's ID
           
        const jobAd = await Job.findByIdAndUpdate(req.params.id, { $push: { comments: comment} }, { new: true });
    
        if (!jobAd) {
          return res.status(404).json({ error: 'Job advertisement not found' });
        }
        res.json(jobAd);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}
// -----------------------views------function--------------------------------------------------------------------------------


export const Views=async(req,res)=>{

    try {
        const jobId = req.params.id;

        // Retrieve the current view count from the database
        const jobAd = await Job.findById(jobId);
        if (!jobAd) {
            return res.status(404).json({ error: 'Job advertisement not found' });
        }

        // Increment the view count by 1
        jobAd.views = (jobAd.views || 0) + 1;

        // Save the updated view count to the database
        await jobAd.save();

        res.json(jobAd);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


// ------------------------report job--------------------------------------------------------------------------------



export const ReportJob = async (req, res) => {
    const { jobId, commentId } = req.body; // Assuming jobId, commentId, and userId are passed in the request body
    const userId=req.authData.userId; 
    try {
        const jobAds = await Job.findById(jobId);
        if (!jobAds) {
            return res.status(404).json({ message: "JobAds not found" });
        }

        // Find the comment in the job's comments array
        const comment = jobAds.comments.find(item => item._id == commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user has already reported this comment
        if (comment.reportedUsers.includes(userId)) {
            return res.status(400).json({ message: "You have already reported this comment" });
        }

        // Perform the reporting action, for example, incrementing a report count
        comment.reportCount = (comment.reportCount || 0) + 1;

        // Add the user to the reportedUsers array to mark that this user has reported the comment
        comment.reportedUsers.push(userId);


             // If the report count exceeds 10, remove the comment from the comments array
             if (comment.reportCount >= 10) {
                jobAds.comments = jobAds.comments.filter(item => item._id != commentId);
            }
        // Save the changes to the job document
        await jobAds.save();

        // Respond with a success message or updated comment
        res.json({ message: "Comment reported successfully", comment });
    } catch (error) {
        console.error("Error reporting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// ------------------------------reviews function ---- start------------------------------------------

export const ReviewsFun = async (req, res) => {
  const {rating, comment } = req.body;
  const jobId = req.params.id;
  const userId=req.authData.userId; 


  try {
    // Retrieve the user profile
    const userProfile = await User.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the user has already submitted a review for this job
    const existingReview = job.reviews.find(review => review.userId.toString() === userId);
    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this job' });
    }

    // Add the review to the job
    job.reviews.push({
      userId: userProfile._id,
      name: userProfile.name,
      email: userProfile.email,
      profilepic: userProfile.profilepic,
      rating: rating,
      comment: comment,
      timestamp: new Date()
    });

    // Calculate average star rating
    let totalRating = 0;
    job.reviews.forEach(review => {
      totalRating += review.rating;
    });
    const numberOfPeople=job.reviews.length;
    const averageRating = totalRating / job.reviews.length;

    // Update job's average rating
    job.totalRating.averageRating = averageRating;
    job.totalRating.numberOfPeople=numberOfPeople;

    // Save the updated job document
    const updatedJob = await job.save();

    res.status(201).json({ message: 'Review added successfully', job: updatedJob });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// ---------------------------------reviews fun end------------------------------------------------------------

