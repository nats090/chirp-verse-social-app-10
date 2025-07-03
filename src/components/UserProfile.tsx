
import React, { useState } from 'react';
import { User, Edit, Camera } from 'lucide-react';

interface UserProfileProps {
  user: {
    username: string;
    email: string;
    bio: string;
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
  onUpdateProfile: (data: { username: string; bio: string }) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    document.getElementById('profile-image-upload')?.click();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-white" />
            )}
          </div>
          {isEditing && (
            <>
              <button
                type="button"
                onClick={triggerImageUpload}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Camera size={16} />
              </button>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </>
          )}
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="text-2xl font-bold border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                  required
                />
              </div>
              
              <div>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/160</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-center sm:justify-start space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Edit size={16} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-2">{user.email}</p>
              <p className="text-gray-800 mb-4">{user.bio || "No bio yet..."}</p>
              
              <div className="flex justify-center sm:justify-start space-x-6">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{user.postsCount}</p>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{user.followersCount}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{user.followingCount}</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
