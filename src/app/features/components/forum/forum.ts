// forum.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { RouterLink } from '@angular/router';

interface ForumPost {
  id: number;
  author: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  timeAgo: string;
  likes: number;
  commentsCount: number;
  views: number;
  isLiked: boolean;
  isPinned: boolean;
  comments: Comment[];
  showComments: boolean;
}

interface Comment {
  id: number;
  author: string;
  authorAvatar: string;
  content: string;
  timeAgo: string;
  likes: number;
  isLiked: boolean;
}

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    AvatarModule,
    BadgeModule,
    ChipModule,
    DividerModule,
    MenuModule,
    RouterLink,
  ],
  templateUrl: './forum.html',
  styleUrl: './forum.scss',
})
export class Forum {
  newCommentText = signal('');
  selectedSort = signal('recent');

  sortOptions = signal([
    { label: 'Più recenti', value: 'recent' },
    { label: 'Più popolari', value: 'popular' },
    { label: 'Più commentati', value: 'commented' },
  ]);

  categories = signal([
    { name: 'Tutti', count: 156, active: true },
    { name: 'Tecnologia', count: 45, active: false },
    { name: 'Fitness', count: 67, active: false },
    { name: 'Studio', count: 34, active: false },
    { name: 'Generale', count: 10, active: false },
  ]);

  popularTags = signal([
    'angular',
    'typescript',
    'web-dev',
    'fitness',
    'workout',
    'study-tips',
    'coding',
    'javascript',
  ]);

  postMenuItems = signal([
    {
      label: 'Modifica',
      icon: 'pi pi-pencil',
      command: () => console.log('Modifica'),
    },
    {
      label: 'Segnala',
      icon: 'pi pi-flag',
      command: () => console.log('Segnala'),
    },
    {
      separator: true,
    },
    {
      label: 'Elimina',
      icon: 'pi pi-trash',
      command: () => console.log('Elimina'),
    },
  ]);

  forumPosts = signal<ForumPost[]>([
    {
      id: 1,
      author: 'Mario Rossi',
      authorAvatar: 'MR',
      title: 'Come implementare Signals in Angular 20?',
      content:
        'Ciao a tutti! Sto iniziando a usare Angular 20 e vorrei capire meglio come funzionano i Signals. Qualcuno ha esperienza da condividere? In particolare mi interesserebbe capire quando è meglio usare signals rispetto agli observables...',
      category: 'Tecnologia',
      tags: ['angular', 'typescript', 'signals'],
      timeAgo: '2 ore fa',
      likes: 24,
      commentsCount: 8,
      views: 156,
      isLiked: false,
      isPinned: true,
      showComments: false,
      comments: [
        {
          id: 1,
          author: 'Laura Bianchi',
          authorAvatar: 'LB',
          content:
            'I Signals sono fantastici! Li uso per gestire lo stato locale dei componenti. Molto più semplici degli observables per casi semplici.',
          timeAgo: '1 ora fa',
          likes: 5,
          isLiked: false,
        },
        {
          id: 2,
          author: 'Giovanni Verdi',
          authorAvatar: 'GV',
          content:
            'Concordo! La reattività è più immediata e il codice è molto più pulito. Ti consiglio di guardare la documentazione ufficiale.',
          timeAgo: '45 min fa',
          likes: 3,
          isLiked: true,
        },
      ],
    },
    {
      id: 2,
      author: 'Anna Ferrari',
      authorAvatar: 'AF',
      title: 'La mia routine di allenamento per aumentare la massa',
      content:
        'Dopo 6 mesi di allenamento costante, voglio condividere la mia routine che mi ha dato ottimi risultati. Focus su esercizi composti e progressione graduale del carico. Cosa ne pensate?',
      category: 'Fitness',
      tags: ['workout', 'fitness', 'massa-muscolare'],
      timeAgo: '5 ore fa',
      likes: 89,
      commentsCount: 23,
      views: 432,
      isLiked: true,
      isPinned: false,
      showComments: false,
      comments: [],
    },
    {
      id: 3,
      author: 'Luca Conti',
      authorAvatar: 'LC',
      title: 'Metodo di studio efficace per programmazione',
      content:
        'Ho sviluppato un metodo di studio che mi ha aiutato molto: 25 minuti di coding, 5 di pausa, ripetere 4 volte. Funziona alla grande per memorizzare i concetti!',
      category: 'Studio',
      tags: ['study-tips', 'coding', 'produttività'],
      timeAgo: '1 giorno fa',
      likes: 67,
      commentsCount: 15,
      views: 289,
      isLiked: false,
      isPinned: false,
      showComments: false,
      comments: [],
    },
  ]);

  selectCategory(name: string) {
    this.categories.update((cats) =>
      cats.map((cat) => ({
        ...cat,
        active: cat.name === name,
      }))
    );
  }

  toggleLike(post: ForumPost) {
    this.forumPosts.update((posts) =>
      posts.map((p) => {
        if (p.id === post.id) {
          return {
            ...p,
            isLiked: !p.isLiked,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      })
    );
  }

  toggleCommentLike(comment: Comment) {
    this.forumPosts.update((posts) =>
      posts.map((post) => ({
        ...post,
        comments: post.comments.map((c) => {
          if (c.id === comment.id) {
            return {
              ...c,
              isLiked: !c.isLiked,
              likes: c.isLiked ? c.likes - 1 : c.likes + 1,
            };
          }
          return c;
        }),
      }))
    );
  }

  toggleComments(post: ForumPost) {
    this.forumPosts.update((posts) =>
      posts.map((p) => ({
        ...p,
        showComments: p.id === post.id ? !p.showComments : p.showComments,
      }))
    );
  }

  addComment(post: ForumPost) {
    const commentText = this.newCommentText();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      author: 'Tu',
      authorAvatar: 'TU',
      content: commentText,
      timeAgo: 'Adesso',
      likes: 0,
      isLiked: false,
    };

    this.forumPosts.update((posts) =>
      posts.map((p) => {
        if (p.id === post.id) {
          return {
            ...p,
            comments: [...p.comments, newComment],
            commentsCount: p.commentsCount + 1,
          };
        }
        return p;
      })
    );

    this.newCommentText.set('');
  }

  cancelComment() {
    this.newCommentText.set('');
  }

  filterByTag(tag: string) {
    console.log('Filtra per tag:', tag);
  }

  openNewPost() {
    console.log('Apri dialog nuovo post');
  }
}
