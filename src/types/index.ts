
export interface Reply {
  id: string;
  author: string;
  authorId: string;
  content: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  author: string;
  authorId: string;
  content: string;
  timestamp: string;
  replies: Reply[];
}

export interface Post {
  id: string;
  authorId?: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  bio: string;
  profileImage?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}
