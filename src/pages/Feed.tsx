
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import EditPostModal from '../components/EditPostModal';
import { Post, Comment } from '../types';

const Feed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPost, setEditingPost] = useState<{ id: string; content: string } | null>(null);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});

  // Fetch posts
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: postsAPI.getAllPosts,
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: postsAPI.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post created!",
        description: "Your post has been shared successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      postsAPI.updatePost(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post updated!",
        description: "Your changes have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update post",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: postsAPI.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete post",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: postsAPI.likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      toast({
        title: "Action failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      postsAPI.addComment(postId, content),
    onSuccess: (newComment, { postId }) => {
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to add comment",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    },
  });

  // Load comments for each post
  useEffect(() => {
    const loadComments = async () => {
      const commentsData: { [postId: string]: Comment[] } = {};
      
      for (const post of posts) {
        try {
          const postComments = await postsAPI.getComments(post.id);
          // Ensure each comment has replies array
          commentsData[post.id] = postComments.map((comment: any) => ({
            ...comment,
            replies: comment.replies || []
          }));
        } catch (error) {
          console.error(`Failed to load comments for post ${post.id}:`, error);
          commentsData[post.id] = [];
        }
      }
      
      setComments(commentsData);
    };

    if (posts.length > 0) {
      loadComments();
    }
  }, [posts]);

  const handleCreatePost = (content: string) => {
    createPostMutation.mutate(content);
  };

  const handleLike = (postId: string) => {
    likePostMutation.mutate(postId);
  };

  const handleEdit = (postId: string) => {
    const post = posts.find((p: Post) => p.id === postId);
    if (post) {
      setEditingPost({ id: post.id, content: post.content });
    }
  };

  const handleSaveEdit = (postId: string, newContent: string) => {
    updatePostMutation.mutate({ postId, content: newContent });
    setEditingPost(null);
  };

  const handleDelete = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(postId);
    }
  };

  const handleAddComment = (postId: string, content: string) => {
    addCommentMutation.mutate({ postId, content });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600">Failed to load posts. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreatePost onCreatePost={handleCreatePost} />
        
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts yet. Create your first post above!</p>
            </div>
          ) : (
            posts.map((post: Post) => (
              <PostCard
                key={post.id}
                post={post}
                postComments={comments[post.id] || []}
                onLike={handleLike}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddComment={handleAddComment}
                isOwner={post.author === user?.username}
              />
            ))
          )}
        </div>
      </div>

      {editingPost && (
        <EditPostModal
          isOpen={true}
          onClose={() => setEditingPost(null)}
          post={editingPost}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Feed;
