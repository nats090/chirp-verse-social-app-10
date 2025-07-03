
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '../services/api';
import { User, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FollowedUser {
  id: string;
  username: string;
  bio: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

const Following = () => {
  const { data: following = [], isLoading } = useQuery({
    queryKey: ['following'],
    queryFn: usersAPI.getFollowing,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Following</h1>
            <p className="text-sm text-gray-600">{following.length} people you follow</p>
          </div>
        </div>

        <div className="space-y-4">
          {following.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Not following anyone yet</h2>
              <p className="text-gray-600">
                Start following people to see their posts and connect with them.
              </p>
            </div>
          ) : (
            following.map((user: FollowedUser) => (
              <Link
                key={user.id}
                to={`/user/${user.id}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300 block"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{user.username}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{user.bio || "No bio yet..."}</p>
                    
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{user.postsCount} posts</span>
                      <span>{user.followersCount} followers</span>
                      <span>{user.followingCount} following</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Following;
