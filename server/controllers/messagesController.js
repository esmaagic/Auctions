const Message = require('../models/Message');

exports.getUserMessages = async (req, res)=>{
    try {
        const {userId} = req.params; // Assuming user ID is passed as a parameter
    
        const messages = await Message.find({receiver: userId}).sort({seen:1, createdAt:-1})
        
        res.status(200).json(messages);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching user messages', error });
      }
}

exports.createMessage = async (req, res)=>{
    try {

        const {user} = req.session
        if (!user || user.username !== "admin") {
          return res.status(403).json({ message: 'Only admin is authorized to create messages.' });
        }

        const { title, content, receiver } = req.body;
    
        // Create a new message
        const newMessage = new Message({
          title,
          content,
          receiver,
        });
    
        // Save message to the database
        await newMessage.save();
    
        res.status(201).json({ message: 'Message created successfully', newMessage });
      } catch (error) {
        res.status(500).json({ message: 'Error creating message', error });
      }
}


exports.markAsRead = async (req, res)=>{
    try {
        const { messageId } = req.params; // Assuming message ID is passed as a parameter
    
        // Find the message and mark it as seen
        const updatedMessage = await Message.findByIdAndUpdate(messageId, { seen: true }, { new: true });
    
        if (!updatedMessage) {
          return res.status(404).json({ message: 'Message not found' });
        }
    
        res.status(200).json({ message: 'Message marked as read', updatedMessage });
      } catch (error) {
        res.status(500).json({ message: 'Error marking message as read', error });
      }
}

exports.hasMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if there's a message where the user is the receiver and the message is not seen
    const messageExists = await Message.exists({ receiver: userId, seen: false });

    // Return true if the message exists, false otherwise
    return res.json( !!messageExists);
  } catch (error) {
    return res.status(500).json({ message: 'Error checking for messages', error });
  }
};