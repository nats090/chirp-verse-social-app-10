
import React, { useState } from 'react';
import { User } from 'lucide-react';

interface CreatePostProps {
  onCreatePost: (content: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onCreatePost(content.trim());
      setContent('');
      setIsFocused(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-white" />
          </div>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What's on your mind?"
              className={`w-full resize-none border-none outline-none text-lg placeholder-gray-500 transition-all ${
                isFocused ? 'min-h-[120px]' : 'min-h-[60px]'
              }`}
              maxLength={280}
            />
            
            <div className={`flex items-center justify-between mt-4 transition-all ${
              isFocused || content ? 'opacity-100' : 'opacity-0'
            }`}>
              <span className="text-sm text-gray-500">
                {content.length}/280
              </span>
              
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
