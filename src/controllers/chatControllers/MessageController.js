import { Conversation } from "../../models/conversationModel.js";
import { Message } from "../../models/messageModel.js";

export const SendMessage = async (req, res) => {

    try {
        const senderId = req.authData.userId; // Assuming authData contains user ID
        const receiverId = req.params.id;
        const { message } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        conversation.messages.push(newMessage._id);
        await conversation.save();

        // If you have Socket.IO integration, emit the new message event here

        return res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const ReceivedMessage = async (req, res) => {

    try {
        const senderId = req.authData.userId; // Assuming authData contains user ID
   
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        return res.status(200).json(conversation.messages);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
