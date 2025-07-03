
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI, postsAPI, messagesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, MessageSquare, UserPlus, UserCheck, Users } from 'lucide-react';
import PostCard from '../components/PostCard';
import { UserProfile as UserProfileType, Post, Comment } from '../types';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({});
  const [followStatus, setFollowStatus] = useState({
    isFollowing: false,
    isFriend: false
  });

  // Fetch user profile
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => usersAPI.getUserProfile(userId!),
    enabled: !!userId,
  });

  // Fetch user posts
  const { data: userPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => postsAPI.getUserPosts(userId!),
    enabled: !!userId,
  });

  // Fetch follow status
  const { data: followStatusData } = useQuery({
    queryKey: ['followStatus', userId],
    queryFn: () => usersAPI.getFollowStatus(userId!),
    enabled: !!userId && userId !== currentUser?.id,
  });

  useEffect(() => {
    if (followStatusData) {
      setFollowStatus({
        isFollowing: followStatusData.isFollowing,
        isFriend: followStatusData.isFriend
      });
    }
  }, [followStatusData]);

  // Follow/Unfollow mutation
  const followMutation = useMutation({
    mutationFn: () => usersAPI.followUser(userId!),
    onSuccess: (data) => {
      setFollowStatus({
        isFollowing: data.isFollowing,
        isFriend: data.isFriend
      });
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
      queryClient.invalidateQueries({ queryKey: ['followStatus', userId] });
      toast({
        title: data.isFollowing ? "Following!" : "Unfollowed",
        description: data.isFollowing ? `You are now following ${userProfile?.username}` : `You unfollowed ${userProfile?.username}`,
      });
    },
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: postsAPI.likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });
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
    },
  });

  // Load comments for posts
  useEffect(() => {
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

  const handleFollow = () => {
    followMutation.mutate();
  };

  const handleMessage = async () => {
    try {
      await messagesAPI.sendMessage(userId!, `Hello ${userProfile?.username}!`);
      toast({
        title: "Message sent!",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleLike = (postId: string) => {
    likePostMutation.mutate(postId);
  };

  const handleAddComment = (postId: string, content: string) => {
    addCommentMutation.mutate({ postId, content });
  };

  if (profileLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
          <p className="text-gray-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={40} className="text-white" />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{userProfile.username}</h1>
              <p className="text-gray-800 mb-4">{userProfile.bio || "No bio yet..."}</p>
              
              <div className="flex justify-center sm:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{userProfile.postsCount}</p>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{userProfile.followersCount}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{userProfile.followingCount}</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>

              {!isOwnProfile && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleFollow}
                    disabled={followMutation.isPending}
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      followStatus.isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {followStatus.isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                    <span>
                      {followStatus.isFollowing ? 'Following' : 'Follow'}
                      {followStatus.isFriend && ' (Friend)'}
                    </span>
                  </button>

                  <button
                    onClick={handleMessage}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageSquare size={16} />
                    <span>Message</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isOwnProfile ? 'Your Posts' : `${userProfile.username}'s Posts`}
          </h2>
          
          <div className="space-y-6">
            {userPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {isOwnProfile ? "You haven't posted anything yet." : "This user hasn't posted anything yet."}
                </p>
              </div>
            ) : (
              userPosts.map((post: Post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  postComments={comments[post.id] || []}
                  onLike={handleLike}
                  onAddComment={handleAddComment}
                  isOwner={false}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
