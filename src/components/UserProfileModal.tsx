
import React, { useState } from 'react';
import { X, User } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    username: string;
    bio: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(user.followersCount);

  if (!isOpen) return null;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{user.username}</h3>
          <p className="text-gray-600 mb-4">{user.bio || "No bio yet..."}</p>
          
          <div className="flex justify-center space-x-6 mb-6">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{user.postsCount}</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{followersCount}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{user.followingCount}</p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
          </div>
          
          <button 
            onClick={handleFollow}
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              isFollowing 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
