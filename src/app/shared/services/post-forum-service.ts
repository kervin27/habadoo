import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  query,
  orderBy,
  limit,
  increment,
  Timestamp,
  arrayRemove,
  arrayUnion,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { ForumPost, CommentPost } from '../models/post-forum.model';
import { AuthService } from '../../core/services/auth-services';

@Injectable({ providedIn: 'root' })
export class PostForumService {
  firestore = inject(Firestore);
  authService = inject(AuthService);

  // ------------------------------------------------------------
  // POST
  // ------------------------------------------------------------

  createPost(post: ForumPost) {
    const postsRef = collection(this.firestore, 'posts');
    return addDoc(postsRef, {
      ...post,
      createdAt: new Date(),
      likes: 0,
      commentsCount: 0,
    });
  }

  getPosts(): Observable<ForumPost[]> {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((posts: any[]) => {
        return posts.map((post) => {
          // 3. Esegui la conversione chiave: da Timestamp a Date
          const firestoreTimestamp = post.createdAt as Timestamp;

          return {
            ...post,
            createdAt: firestoreTimestamp.toDate(),
          } as ForumPost;
        });
      })
    ) as Observable<ForumPost[]>;
  }

  getPostById(postId: string) {
    const postRef = doc(this.firestore, `posts/${postId}`);
    return getDoc(postRef);
  }

  likePost(post: ForumPost) {
    const postRef = doc(this.firestore, `posts/${post.id}`);
    const currentUserId = this.authService.user()?.uid;

    if (post.likedBy?.includes(currentUserId!)) {
      return updateDoc(postRef, {
        likes: increment(-1),
        isLiked: false,
        likedBy: arrayRemove(currentUserId!),
      });
    } else {
      return updateDoc(postRef, {
        likes: increment(1),
        isLiked: true,
        likedBy: arrayUnion(currentUserId!),
      });
    }
  }

  deletePost(postId: string) {
    const postRef = doc(this.firestore, `posts/${postId}`);
    return deleteDoc(postRef);
  }

  // ------------------------------------------------------------
  // COMMENTI (subcollection)
  // ------------------------------------------------------------

  addComment(postId: string, comment: CommentPost) {
    const commentsRef = collection(this.firestore, `posts/${postId}/comments`);

    const newComment = {
      ...comment,
      createdAt: new Date(),
      likes: 0,
    };

    // Aggiorna contatore commenti nel post
    const postRef = doc(this.firestore, `posts/${postId}`);
    updateDoc(postRef, { commentsCount: increment(1) });

    return addDoc(commentsRef, newComment);
  }

  getComments(postId: string): Observable<CommentPost[]> {
    const commentsRef = collection(this.firestore, `posts/${postId}/comments`);
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((comment: any[]) => {
        return comment.map((post) => {
          // 3. Esegui la conversione chiave: da Timestamp a Date
          const firestoreTimestamp = post.createdAt as Timestamp;

          return {
            ...post,
            createdAt: firestoreTimestamp.toDate(),
          } as ForumPost;
        });
      })
    ) as Observable<CommentPost[]>;
  }

  likeComment(postId: string, comment: CommentPost) {
    const commentRef = doc(
      this.firestore,
      `posts/${postId}/comments/${comment.id}`
    );

    const currentUserId = this.authService.user()?.uid;

    if (comment.likedBy?.includes(currentUserId!)) {
      return updateDoc(commentRef, {
        likes: increment(-1),
        isLiked: false,
        likedBy: arrayRemove(currentUserId!),
      });
    } else {
      return updateDoc(commentRef, {
        likes: increment(1),
        isLiked: true,
        likedBy: arrayUnion(currentUserId!),
      });
    }
  }

  unlikeComment(postId: string, commentId: string) {
    const commentRef = doc(
      this.firestore,
      `posts/${postId}/comments/${commentId}`
    );
    return updateDoc(commentRef, { likes: increment(-1) });
  }

  deleteComment(postId: string, commentId: string) {
    const commentRef = doc(
      this.firestore,
      `posts/${postId}/comments/${commentId}`
    );

    // decrementa contatore
    const postRef = doc(this.firestore, `posts/${postId}`);
    updateDoc(postRef, { commentsCount: increment(-1) });

    return deleteDoc(commentRef);
  }
}
