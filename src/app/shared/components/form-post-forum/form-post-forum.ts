import { Component, signal, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ForumPost } from '../../models/post-forum.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { PostForumService } from '../../services/post-forum-service';
import { ToastService } from '../../../core/services/toast-service';
import { AuthService } from '../../../core/services/auth-services';

@Component({
  selector: 'app-form-post-forum',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
  ],
  templateUrl: './form-post-forum.html',
  styleUrl: './form-post-forum.scss',
})
export class FormPostForum {
  postForumService = inject(PostForumService);
  toastService = inject(ToastService);
  authService = inject(AuthService);
  charCount = signal(0);
  showValidationSummary = signal(false);

  postForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    content: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(2000),
    ]),
  });

  dialogClosed = output<void>();

  ngOninit() {
    const contentSignal = toSignal(this.postForm.get('content')!.valueChanges, {
      initialValue: this.postForm.get('content')!.value || '',
    });

    // Effect per aggiornare il contatore caratteri
    effect(() => {
      this.charCount.set(contentSignal().length);
    });
  }

  closeDialog() {
    this.dialogClosed.emit();
  }

  async publishPost() {
    // Valida il form
    if (!this.postForm.valid) {
      this.showValidationSummary.set(true);
      return;
    }

    const formValue = this.postForm.value;

    const newPost: ForumPost = {
      userId: this.authService.user()?.uid!, // Sostituire con l'ID utente reale
      author: this.authService.user()?.displayName!, // Sostituire con il nome utente reale
      authorAvatar: this.authService.user()?.displayName![0],
      title: formValue.title,
      content: formValue.content,
      category: '',
      createdAt: new Date(),
      likes: 0,
      isLiked: false,
      commentsCount: 0,
      isPinned: false,
      likedBy: [],
    };

    this.postForumService.createPost(newPost).then((res) => {
      this.toastService.success(
        'CONFERMA',
        'Il post è stato inserito con successo'
      );
      this.closeDialog();
    });
  }
}
