import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { RouterLink } from '@angular/router';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  author: string;
  time: string;
  likes: number;
  comments: number;
  image: string;
}

interface Category {
  name: string;
  icon: string;
  count: string;
  color: string;
}

interface TrendingTopic {
  tag: string;
  posts: number;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    AvatarModule,
    BadgeModule,
    DrawerModule,
    MenuModule,
    ChipModule,
    TagModule,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  // Signals per la gestione dello stato (no Zone.js)
  sidebarVisible = signal(false);
  activeMenuItem = signal('Home');

  menuItems = signal([
    { label: 'Home', icon: 'pi pi-home', active: true },
    { label: 'Forum', icon: 'pi pi-comments', active: false, path: '/forum' },
    // { label: 'Galleria', icon: 'pi pi-images', active: false },
    // { label: 'Schede Palestra', icon: 'pi pi-chart-bar', active: false },
    // { label: 'Appunti', icon: 'pi pi-file', active: false },
  ]);

  categories = signal<Category[]>([
    {
      name: 'Forum',
      icon: 'pi pi-comments',
      count: '2.5k discussioni',
      color: 'bg-blue-500',
    },
    // {
    //   name: 'Galleria',
    //   icon: 'pi pi-images',
    //   count: '15k immagini',
    //   color: 'bg-purple-500',
    // },
    // {
    //   name: 'Schede Palestra',
    //   icon: 'pi pi-chart-bar',
    //   count: '890 schede',
    //   color: 'bg-green-500',
    // },
    // {
    //   name: 'Appunti',
    //   icon: 'pi pi-file',
    //   count: '3.2k documenti',
    //   color: 'bg-orange-500',
    // },
  ]);

  newsItems = signal<NewsItem[]>([
    {
      id: 1,
      title: 'Nuove funzionalità Angular 20 rilasciate',
      category: 'Tech',
      author: 'Mario Rossi',
      time: '2h fa',
      likes: 45,
      comments: 12,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    },
    // {
    //   id: 2,
    //   title: 'I migliori esercizi per aumentare la massa muscolare',
    //   category: 'Fitness',
    //   author: 'Laura Bianchi',
    //   time: '4h fa',
    //   likes: 128,
    //   comments: 34,
    //   image:
    //     'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    // },
    // {
    //   id: 3,
    //   title: 'Come organizzare gli appunti per lo studio',
    //   category: 'Studio',
    //   author: 'Giovanni Verdi',
    //   time: '1g fa',
    //   likes: 89,
    //   comments: 23,
    //   image:
    //     'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
    // },
  ]);

  trendingTopics = signal<TrendingTopic[]>([
    { tag: '#Angular20', posts: 456 },
    { tag: '#Workout2024', posts: 892 },
    { tag: '#StudyTips', posts: 234 },
    { tag: '#WebDev', posts: 678 },
  ]);

  setActiveMenu(label: string) {
    this.menuItems.update((items) =>
      items.map((item) => ({
        ...item,
        active: item.label === label,
      }))
    );
    this.activeMenuItem.set(label);
  }
}
