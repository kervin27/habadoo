export interface ForumPost {
  id?: string;
  userId: string;
  author: string;
  authorAvatar?: string;

  title: string;
  content: string;
  category: string;

  createdAt: Date;
  updatedAt?: Date;

  likes?: number;
  isLiked?: boolean;
  likedBy?: string[];

  commentsCount?: number;
  isPinned?: boolean;
  showComments?: boolean;
  comments?: CommentPost[];
}

export interface CommentPost {
  id?: string;
  postId?: string;
  userId: string;
  author: string;
  authorAvatar?: string;

  content: string;
  createdAt: Date;

  likes?: number;
  isLiked?: boolean;
  likedBy?: string[];
}
