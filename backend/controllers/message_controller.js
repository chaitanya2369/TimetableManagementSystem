const Message = require('../models/message');

module.exports.viewMessages = async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id }).sort({ createdAt: -1 }).populate('sender');
    res.render('view_messages', { messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).send('Error fetching messages');
  }
};
