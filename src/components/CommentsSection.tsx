
import React, { useState } from 'react';
import { User, Send, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Comment, Reply } from '../types';

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, comments, onAddComment }) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [commentReplies, setCommentReplies] = useState<{ [commentId: string]: Reply[] }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(postId, newComment.trim());
      setNewComment('');
    }
  };

  const handleReply = async (commentId: string) => {
    if (replyContent.trim()) {
      try {
        const newReply = await postsAPI.addReply(postId, commentId, replyContent.trim());
        setCommentReplies(prev => ({
          ...prev,
          [commentId]: [...(prev[commentId] || []), newReply]
        }));
        setReplyContent('');
        setReplyingTo(null);
      } catch (error) {
        console.error('Failed to add reply:', error);
      }
    }
  };

  // Initialize replies from props
  React.useEffect(() => {
    const repliesMap: { [commentId: string]: Reply[] } = {};
    comments.forEach(comment => {
      if (comment.replies && comment.replies.length > 0) {
        repliesMap[comment.id] = comment.replies;
      }
    });
    setCommentReplies(repliesMap);
  }, [comments]);

  return (
    <div className="mt-4">
      {comments.length > 0 && (
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-sm text-gray-600 hover:text-blue-600 mb-3"
        >
          {showComments ? 'Hide' : 'View'} {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </button>
      )}
      
      {showComments && (
        <div className="space-y-4 mb-4 pl-4 border-l-2 border-gray-100">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex items-start space-x-3">
                <Link to={`/user/${comment.authorId}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform">
                    <User size={12} className="text-white" />
                  </div>
                </Link>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Link 
                      to={`/user/${comment.authorId}`}
                      className="font-medium text-sm text-gray-900 hover:text-blue-600"
                    >
                      {comment.author}
                    </Link>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
                  
                  {user && comment.authorId !== user.id && (
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-xs text-gray-500 hover:text-blue-600 mt-1 flex items-center space-x-1"
                    >
                      <MessageSquare size={12} />
                      <span>Reply</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Replies */}
              {commentReplies[comment.id] && commentReplies[comment.id].length > 0 && (
                <div className="ml-6 space-y-2 border-l border-gray-200 pl-3">
                  {commentReplies[comment.id].map((reply) => (
                    <div key={reply.id} className="flex items-start space-x-2">
                      <Link to={`/user/${reply.authorId}`}>
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform">
                          <User size={10} className="text-white" />
                        </div>
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Link 
                            to={`/user/${reply.authorId}`}
                            className="font-medium text-xs text-gray-900 hover:text-blue-600"
                          >
                            {reply.author}
                          </Link>
                          <span className="text-xs text-gray-500">{reply.timestamp}</span>
                        </div>
                        <p className="text-xs text-gray-800 mt-1">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              {replyingTo === comment.id && (
                <div className="ml-6 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={10} className="text-white" />
                  </div>
                  <div className="flex-1 flex">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Reply to ${comment.author}...`}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      maxLength={200}
                      onKeyPress={(e) => e.key === 'Enter' && handleReply(comment.id)}
                    />
                    <button
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyContent.trim()}
                      className="px-2 py-1 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={12} className="text-white" />
        </div>
        <div className="flex-1 flex">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            maxLength={200}
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentsSection;
