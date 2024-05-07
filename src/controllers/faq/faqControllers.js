import FAQ from "../../models/products/faqModels.js";
// Create a new FAQ
export const createFaq= async (req, res) => {
    try {
      const { question, answer } = req.body;
      const faq = new FAQ({ question, answer });
      await faq.save();
      res.status(201).json(faq);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
// Get all FAQs
export const getAllFaq=async (req, res) => {
    try {
      const faqs = await FAQ.find();
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Get a single FAQ
  export const getSingleFaq=async (req, res) => {
    try {
      const faq = await FAQ.findById(req.params.id);
      if (faq) {
        res.json(faq);
      } else {
        res.status(404).json({ message: "FAQ not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update a FAQ
  export const updateFaq=async (req, res) => {
    try {
      const { question, answer } = req.body;
      const faq = await FAQ.findByIdAndUpdate(
        req.params.id,
        { question, answer },
        { new: true }
      );
      if (faq) {
        res.json(faq);
      } else {
        res.status(404).json({ message: "FAQ not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete a FAQ
  export const deleteFaq=async (req, res) => {
    try {
      const faq = await FAQ.findByIdAndDelete(req.params.id);
      if (faq) {
        res.json({ message: "FAQ deleted successfully" });
      } else {
        res.status(404).json({ message: "FAQ not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };