const User = require('../models/User');
const Article = require('../models/Article'); 

const getCurrentUser = async (req,res)=> {
    try {
        if (!req.session.user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = await User.findById(req.session.user._id)
        .populate({
            path: 'saved', // populate the 'saved' articles
            populate: { path: 'images' } // for each article, populate the 'images' array
        });
        
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const addToSaved = async (req, res) => {
    try {
      const { articleId } = req.params;
      const user = await User.findById(req.session.user._id);
      const article = await Article.findById(articleId);
  
      if (article) {
        // Check if the article is already in the saved list
        if (!user.saved.includes(articleId)) {
          user.saved.push(articleId); // Add the articleId to the saved list
          await user.save(); // Save the updated user document
          return res.status(200).json({ message: 'Article added to saved list' });
        } else {
          return res.status(400).json({ message: 'Article is already saved' });
        }
      } else {
        return res.status(404).json({ message: 'Article not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  };

const removeFromSaved = async (req, res) => {
  try {
    const { articleId } = req.params;
    const user = await User.findById(req.session.user._id);
    const article = await Article.findById(articleId);

    if (article) {
      // Check if the article is in the saved list
      if (user.saved.includes(articleId)) {
        // Remove the articleId from the saved list
        user.saved = user.saved.filter(id => id.toString() !== articleId);
        await user.save(); // Save the updated user document
        return res.status(200).json({ message: 'Article removed from saved list' });
      } else {
        return res.status(400).json({ message: 'Article not found in saved list' });
      }
    } else {
      return res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ username: { $ne: 'admin' } }).sort({ username: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

const banUser = async(req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(userId, { banned: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User has been banned', user });
  } catch (error) {
    res.status(500).json({ message: 'Error banning user', error });
  }
}

const unbanUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(userId, { banned: false }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User has been unbanned', user });
  } catch (error) {
    res.status(500).json({ message: 'Error unbanning user', error });
  }
};

module.exports = {getCurrentUser, addToSaved,removeFromSaved, getAllUsers, banUser, unbanUser}