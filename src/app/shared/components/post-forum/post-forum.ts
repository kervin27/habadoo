import {
  Component,
  effect,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { ForumPost } from '../../models/post-forum.model';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { AuthService } from '../../../core/services/auth-services';
import { PostForumService } from '../../services/post-forum-service';
import { map, take, tap } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommentPost } from '../../models/post-forum.model';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-post-forum',
  imports: [
    AvatarModule,
    ButtonModule,
    ChipModule,
    CardModule,
    MenuModule,
    DividerModule,
    TimeAgoPipe,
    FormsModule,
  ],
  templateUrl: './post-forum.html',
  styleUrl: './post-forum.scss',
})
export class PostForum {
  post = input<ForumPost>();
  authService = inject(AuthService);
  postForumService = inject(PostForumService);
  toastService = inject(ToastService);

  postWriteble!: WritableSignal<ForumPost>;

  newCommentText = signal<string>('');
  commentoSelezionato = signal<CommentPost | null>(null);

  constructor() {
    // Inizializza il Signal scrivibile
    this.postWriteble = signal(this.post()!);

    // 3. Effect: Collega il Signal scrivibile all'Input Read-Only per la reattività
    effect(() => {
      // Quando il Genitore aggiorna 'post()', esegui l'update
      const newPostData = this.post();

      if (!newPostData) {
        return;
      }
      this.postWriteble.update((currentPost) => {
        const currentShowComments = currentPost
          ? currentPost.showComments
          : false;
        const currentComments = currentPost ? currentPost.comments : [];
        return {
          ...newPostData,
          showComments: currentShowComments,
          comments: currentComments,
        };
      });
    });
  }

  postMenuItems = signal([
    // {
    //   label: 'Modifica',
    //   icon: 'pi pi-pencil',
    //   command: () => console.log('Modifica'),
    // },
    // {
    //   separator: true,
    // },
    {
      label: 'Elimina',
      icon: 'pi pi-trash',
      command: () => this.cancelPost(),
    },
  ]);

  toogleCommentItems = signal([
    {
      label: 'Modifica',
      icon: 'pi pi-pencil',
      command: () => console.log('Modifica'),
    },
    {
      separator: true,
    },
    {
      label: 'Elimina',
      icon: 'pi pi-trash',
      command: () => this.cancelComment(),
    },
  ]);

  toggleLike(post: ForumPost) {
    this.postForumService.likePost(post!).then();
  }

  toggleCommentLike(postId: string, comment: CommentPost): void {
    // 1. Chiamata al servizio per eseguire l'update su Firestore.
    this.postForumService
      .likeComment(postId, comment)
      .then(() => {
        // 2. L'operazione SU FIREBASE HA AVUTO SUCCESSO.
        // Ora aggiorniamo il Signal locale con i NUOVI valori.
        this.postWriteble.update((currentPost) => {
          if (!currentPost || !currentPost.comments) {
            return currentPost;
          }

          // 3. Mappa l'array di commenti per trovare quello modificato.
          const updatedComments = currentPost.comments.map((c) => {
            if (c.id === comment.id) {
              // Logica per determinare se l'utente ha messo o tolto like
              const currentUserId = this.authService.user()?.uid;
              const isCurrentlyLiked = c.likedBy?.includes(currentUserId!);

              // Calcolo del nuovo stato
              const newLikedBy = isCurrentlyLiked
                ? c.likedBy!.filter((uid) => uid !== currentUserId) // Rimuovi l'UID
                : [...(c.likedBy || []), currentUserId!]; // Aggiungi l'UID

              return {
                ...c,
                likes: c.likes! + (isCurrentlyLiked ? -1 : 1), // Incrementa o decrementa
                likedBy: newLikedBy,
                isLiked: !isCurrentlyLiked, // Inverti lo stato
              };
            }
            return c; // Restituisce i commenti non modificati
          });

          // 4. Aggiorna il post intero con l'array di commenti aggiornato
          return {
            ...currentPost,
            comments: updatedComments,
          };
        });
      })
      .catch((error) => {
        console.error('Errore nel like/unlike del commento:', error);
        // Qui potresti mostrare un messaggio di errore all'utente
      });
  }

  // Assumiamo che questa sia una funzione nel tuo componente:
  toggleComments(post: ForumPost): void {
    // 1. Inizia recuperando i commenti
    this.postForumService
      .getComments(post.id!)
      .pipe(
        // 2. Mappa i dati dei commenti
        map((comments) => {
          // Potresti fare una logica aggiuntiva qui se necessario, ma l'obiettivo principale
          // è solo avere i commenti nell'Observable stream.
          return comments;
        }),

        // 3. Usa 'tap' per eseguire l'effetto collaterale: AGGIORNARE il Signal.
        // L'Observable emetterà l'array di commenti qui.
        tap((comments) => {
          // La funzione 'tap' aggiorna il Signal SINCROAMENTE
          this.postWriteble.update((currentPost) => {
            // Questo è il punto cruciale:
            // Aggiorna sia lo stato di showComments che aggiunge i commenti
            return {
              ...currentPost,
              // Aggiungi i commenti al modello del post
              comments: comments,
              // Inverti lo stato di visibilità
              showComments: !currentPost.showComments,
            };
          });
        }),
        // 4. Se stai usando Observable che si completano da soli (come le letture da Firestore),
        // una volta completato il 'tap' puoi non usare subscribe o gestirlo altrove.
        // Se la chiamata è reattiva (continua ad ascoltare), potresti aver bisogno di
        // un operatore come take(1) se vuoi che succeda solo una volta.

        take(1) // Usa take(1) per completare l'Observable dopo la prima emissione
      )
      .subscribe({
        // Opzionale: gestione degli errori e completamento
        error: (err) =>
          console.error('Errore nel caricamento dei commenti:', err),
        // Se non ti serve l'effetto a valle, usa solo un subscribe vuoto
      });
  }

  addComment(post: ForumPost) {
    const commentText = this.newCommentText();
    if (!commentText.trim()) return;

    const newComment: CommentPost = {
      userId: this.authService.user()?.uid!, // Sostituire con l'ID utente reale
      author: this.authService.user()?.displayName!, // Sostituire con il nome utente reale
      authorAvatar: this.authService.user()?.displayName![0],
      content: commentText,
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      likedBy: [],
    };

    this.postForumService.addComment(this.post()?.id!, newComment);
    this.postWriteble.update((currentPost) => {
      // Questo è il punto cruciale:
      // Aggiorna sia lo stato di showComments che aggiunge i commenti
      return {
        ...currentPost,
        // Aggiungi i commenti al modello del post
        comments: currentPost.comments,
        // Inverti lo stato di visibilità
        showComments: currentPost.showComments,
      };
    });
    this.newCommentText.set('');
  }

  cancelPost() {
    this.postForumService.deletePost(this.post()?.id!).then((res) => {
      this.toastService.success(
        'CONFERMA',
        'Il post è stato eliminato con successo'
      );
    });
  }

  cancelComment() {
    this.postForumService
      .deleteComment(this.post()?.id!, this.commentoSelezionato()?.id!)
      .then(() => {
        this.toastService.success(
          'CONFERMA',
          'Il post è stato eliminato con successo'
        );
        this.postWriteble.update((currentPost) => {
          // Questo è il punto cruciale:
          // Aggiorna sia lo stato di showComments che aggiunge i commenti
          return {
            ...currentPost,
            // Aggiungi i commenti al modello del post
            comments: currentPost.comments?.filter(
              (res) => res !== this.commentoSelezionato()
            ),
            // Inverti lo stato di visibilità
            showComments: true,
            commentsCount: currentPost.commentsCount,
          };
        });
      });
  }

  annullaCommento() {
    this.postWriteble.update((currentPost) => {
      // Questo è il punto cruciale:
      // Aggiorna sia lo stato di showComments che aggiunge i commenti
      return {
        ...currentPost,
        // Aggiungi i commenti al modello del post
        comments: currentPost.comments,
        // Inverti lo stato di visibilità
        showComments: false,
      };
    });
  }

  commentSelected(comment: CommentPost | null) {
    this.commentoSelezionato.set(comment);
  }
}
