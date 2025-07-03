
const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('authorId', 'username profileImage');

    const formattedPosts = posts.map(post => ({
      id: post._id,
      authorId: post.authorId._id,
      author: post.author,
      content: post.content,
      timestamp: post.timestamp,
      likes: post.likes,
      comments: post.comments.length,
      isLiked: false // This would be determined by the authenticated user
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get posts by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate('authorId', 'username profileImage');

    const formattedPosts = posts.map(post => ({
      id: post._id,
      authorId: post.authorId._id,
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

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const user = await User.findById(req.userId);

    const post = new Post({
      author: user.username,
      authorId: user._id,
      content,
      timestamp: new Date().toISOString()
    });

    await post.save();

    // Update user's post count
    user.postsCount += 1;
    await user.save();

    res.status(201).json({
      id: post._id,
      authorId: post.authorId,
      author: post.author,
      content: post.content,
      timestamp: post.timestamp,
      likes: post.likes,
      comments: 0,
      isLiked: false
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike a post
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.userId;
    const isLiked = post.likedBy.includes(userId);

    if (isLiked) {
      // Unlike the post
      post.likedBy.pull(userId);
      post.likes -= 1;
    } else {
      // Like the post
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();

    res.json({
      likes: post.likes,
      isLiked: !isLiked
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    post.content = content;
    await post.save();

    res.json({
      id: post._id,
      authorId: post.authorId,
      author: post.author,
      content: post.content,
      timestamp: post.timestamp,
      likes: post.likes,
      comments: post.comments.length,
      isLiked: false
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    // Update user's post count
    const user = await User.findById(req.userId);
    user.postsCount = Math.max(0, user.postsCount - 1);
    await user.save();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a comment to a post
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.userId);

    const newComment = {
      author: user.username,
      authorId: user._id,
      content,
      timestamp: new Date().toISOString(),
      replies: []
    };

    post.comments.push(newComment);
    await post.save();

    const savedComment = post.comments[post.comments.length - 1];
    res.status(201).json({
      id: savedComment._id,
      author: savedComment.author,
      authorId: savedComment.authorId,
      content: savedComment.content,
      timestamp: savedComment.timestamp,
      replies: []
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a reply to a comment
router.post('/:postId/comments/:commentId/replies', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const { postId, commentId } = req.params;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const user = await User.findById(req.userId);
    const newReply = {
      author: user.username,
      authorId: user._id,
      content,
      timestamp: new Date().toISOString()
    };

    comment.replies.push(newReply);
    await post.save();

    const savedReply = comment.replies[comment.replies.length - 1];
    res.status(201).json({
      id: savedReply._id,
      author: savedReply.author,
      authorId: savedReply.authorId,
      content: savedReply.content,
      timestamp: savedReply.timestamp
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get comments for a post
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const formattedComments = post.comments.map(comment => ({
      id: comment._id,
      author: comment.author,
      authorId: comment.authorId,
      content: comment.content,
      timestamp: comment.timestamp,
      replies: comment.replies.map(reply => ({
        id: reply._id,
        author: reply.author,
        authorId: reply.authorId,
        content: reply.content,
        timestamp: reply.timestamp
      }))
    }));

    res.json(formattedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
