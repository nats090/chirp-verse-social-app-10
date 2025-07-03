
import React, { useState } from 'react';
import { User, Image, Smile } from 'lucide-react';

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
    <div className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <User size={20} className="text-primary-foreground" />
          </div>
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="What's on your mind?"
              className={`w-full resize-none border-none outline-none text-lg placeholder-muted-foreground bg-transparent transition-all duration-300 ${
                isFocused ? 'min-h-[120px]' : 'min-h-[60px]'
              }`}
              maxLength={280}
            />
            
            <div className={`flex items-center justify-between mt-4 transition-all duration-300 ${
              isFocused || content ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-full transition-all duration-200"
                >
                  <Image size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-full transition-all duration-200"
                >
                  <Smile size={20} />
                </button>
                <span className="text-sm text-muted-foreground">
                  {content.length}/280
                </span>
              </div>
              
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
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
