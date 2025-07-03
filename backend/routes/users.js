
const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
      postsCount: user.postsCount,
      followersCount: user.followersCount,
      followingCount: user.followingCount
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by ID
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      bio: user.bio,
      profileImage: user.profileImage,
      postsCount: user.postsCount,
      followersCount: user.followersCount,
      followingCount: user.followingCount
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, bio } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if username is already taken by another user
    if (username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    user.username = username;
    user.bio = bio;
    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
      postsCount: user.postsCount,
      followersCount: user.followersCount,
      followingCount: user.followingCount
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's posts
router.get('/posts', auth, async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.userId })
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map(post => ({
      id: post._id,
      authorId: post.authorId,
      author: post.author,
      content: post.content,
      timestamp: post.timestamp,
      likes: post.likes,
      comments: post.comments.length,
      isLiked: false
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow/Unfollow a user
router.put('/follow/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.userId;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
      currentUser.followingCount -= 1;
      targetUser.followersCount -= 1;
    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      currentUser.followingCount += 1;
      targetUser.followersCount += 1;
    }

    await currentUser.save();
    await targetUser.save();

    // Check if they are friends (both following each other)
    const isFriend = targetUser.following.includes(currentUserId) && !isFollowing;

    res.json({
      isFollowing: !isFollowing,
      isFriend,
      followersCount: targetUser.followersCount
    });
  } catch (error) {
    console.error('Error following/unfollowing user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check follow status
router.get('/follow-status/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.userId;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(targetUserId);
    const isFollowedBy = targetUser.following.includes(currentUserId);
    const isFriend = isFollowing && isFollowedBy;

    res.json({
      isFollowing,
      isFollowedBy,
      isFriend
    });
  } catch (error) {
    console.error('Error checking follow status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get following list
router.get('/following', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('following', 'username bio profileImage postsCount followersCount followingCount');
    
    const following = user.following.map(followedUser => ({
      id: followedUser._id,
      username: followedUser.username,
      bio: followedUser.bio,
      profileImage: followedUser.profileImage,
      postsCount: followedUser.postsCount,
      followersCount: followedUser.followersCount,
      followingCount: followedUser.followingCount
    }));

    res.json(following);
  } catch (error) {
    console.error('Error fetching following list:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get followers list
router.get('/followers', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('followers', 'username bio profileImage postsCount followersCount followingCount');
    
    const followers = user.followers.map(follower => ({
      id: follower._id,
      username: follower.username,
      bio: follower.bio,
      profileImage: follower.profileImage,
      postsCount: follower.postsCount,
      followersCount: follower.followersCount,
      followingCount: follower.followingCount
    }));

    res.json(followers);
  } catch (error) {
    console.error('Error fetching followers list:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
