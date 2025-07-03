
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI, postsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import UserProfile from '../components/UserProfile';
import PostCard from '../components/PostCard';
import EditPostModal from '../components/EditPostModal';
import { Post, Comment } from '../types';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPost, setEditingPost] = useState<{ id: string; content: string } | null>(null);
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});

  // Fetch user posts
  const { data: userPosts = [], isLoading } = useQuery({
    queryKey: ['userPosts'],
    queryFn: usersAPI.getUserPosts,
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      postsAPI.updatePost(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      toast({
        title: "Post updated!",
        description: "Your changes have been saved.",
      });
    },
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: postsAPI.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
    },
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: postsAPI.likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
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
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });

  // Load comments for posts
  React.useEffect(() => {
    const loadComments = async () => {
      const commentsData: { [postId: string]: Comment[] } = {};
      
      for (const post of userPosts) {
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

    if (userPosts.length > 0) {
      loadComments();
    }
  }, [userPosts]);

  const handleUpdateProfile = async (data: { username: string; bio: string }) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLike = (postId: string) => {
    likePostMutation.mutate(postId);
  };

  const handleEdit = (postId: string) => {
    const post = userPosts.find((p: Post) => p.id === postId);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserProfile user={user} onUpdateProfile={handleUpdateProfile} />
        
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Posts</h2>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">You haven't posted anything yet. Go to the feed to create your first post!</p>
                </div>
              ) : (
                userPosts.map((post: Post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    postComments={comments[post.id] || []}
                    onLike={handleLike}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddComment={handleAddComment}
                    isOwner={true}
                  />
                ))
              )}
            </div>
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

export default Profile;
