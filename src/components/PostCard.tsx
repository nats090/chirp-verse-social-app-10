
import React, { useState } from 'react';
import { Heart, MessageSquare, User, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import CommentsSection from './CommentsSection';
import { Comment, Post } from '../types';

interface PostCardProps {
  post: Post;
  postComments: Comment[];
  onLike: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddComment: (postId: string, content: string) => void;
  isOwner?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  postComments, 
  onLike, 
  onEdit, 
  onDelete, 
  onAddComment,
  isOwner = false 
}) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/20 hover:-translate-y-1"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start space-x-4">
        <Link to={post.authorId ? `/user/${post.authorId}` : '#'}>
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 hover:scale-110 transition-transform duration-200 shadow-lg">
            <User size={20} className="text-primary-foreground" />
          </div>
        </Link>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link 
                to={post.authorId ? `/user/${post.authorId}` : '#'}
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                {post.author}
              </Link>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm">{post.timestamp}</span>
            </div>
            
            {isOwner && showActions && (
              <div className="flex items-center space-x-1 opacity-0 animate-fade-in">
                {onEdit && (
                  <button
                    onClick={() => onEdit(post.id)}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-full transition-all duration-200"
                  >
                    <Edit size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(post.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
          
          <p className="text-foreground mt-3 leading-relaxed text-base">{post.content}</p>
          
          <div className="flex items-center space-x-6 mt-5">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 ${
                post.isLiked
                  ? 'text-red-500 bg-red-50 hover:bg-red-100 shadow-md'
                  : 'text-muted-foreground hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
            
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-200">
              <MessageSquare size={18} />
              <span className="text-sm font-medium">{postComments.length}</span>
            </div>
          </div>

          <CommentsSection
            postId={post.id}
            comments={postComments}
            onAddComment={onAddComment}
          />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
