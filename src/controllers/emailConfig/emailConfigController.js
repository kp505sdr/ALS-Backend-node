import {EmailConfig} from "../../models/emailConfigModels.js"


export const createEmailConfig=async(req,res)=>{

    const checkIfDataExists = async () => {
        const count = await EmailConfig.countDocuments();
        return count > 0;
      };
      
    try {
        const dataExists = await checkIfDataExists();
        if (dataExists) {
          return res.status(400).json({ error: 'Configration already exists' });
        }
    
        const emailConfig = await EmailConfig.create(req.body);
        res.status(201).json(emailConfig);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}

// -----------------------------get-email-config--------------------------------
export const getEmailConfig=async(req,res)=>{
    try {
        const emailConfigs = await EmailConfig.find();
        res.json(emailConfigs);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }

// ------------------update-email-config--------------------------------------------

export const updateEmailConfig=async(req,res)=>{
    try {
        const { id } = req.params;
        const emailConfig = await EmailConfig.findByIdAndUpdate(id, req.body, { new: true });
        if (!emailConfig) {
          return res.status(404).json({ error: 'Email config not found' });
        }
        res.json(emailConfig);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}

// ------------------delete-email-config--------------------------
export const deleteEmailConfig=async(req,res)=>{
    try {
        const { id } = req.params;
        const emailConfig = await EmailConfig.findByIdAndDelete(id);
        if (!emailConfig) {
          return res.status(404).json({ error: 'Email config not found' });
        }
        res.json({ message: 'Email config deleted successfully' });
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
}

  