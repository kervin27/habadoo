import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import { Auth, signInAnonymously } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-user',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    ButtonModule,
    InputTextModule,
    ProgressBarModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './profile-user.html',
  styleUrl: './profile-user.scss',
})
export class ProfileUser implements OnInit {
  private storage = inject(Storage);
  private auth = inject(Auth);
  fb = inject(FormBuilder);

  profileForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploadProgress: number = -1;
  isUploading: boolean = false;

  constructor() {
    this.profileForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      username: [''],
    });
  }

  ngOnInit() {}

  onFileSelected(event: any) {
    this.selectedFile = event.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      alert('Seleziona prima un’immagine!');
      return;
    }

    const filePath = `immagini/${Date.now()}_${this.selectedFile.name}`;
    const storageRef = ref(this.storage, filePath);

    const doUpload = () => {
      this.isUploading = true;

      const uploadTask = uploadBytesResumable(storageRef, this.selectedFile!);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          this.uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.error('Errore upload:', error);
          alert('Errore durante l’upload');
          this.isUploading = false;
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log('Immagine caricata:', url);
            alert('Upload completato!');
            this.uploadProgress = -1;
            this.isUploading = false;
          });
        }
      );
    };

    if (!this.auth.currentUser) {
      signInAnonymously(this.auth)
        .then(() => doUpload())
        .catch((err) => {
          console.error('Errore login anonimo:', err);
          this.isUploading = false;
        });
    } else {
      doUpload();
    }
  }
}
