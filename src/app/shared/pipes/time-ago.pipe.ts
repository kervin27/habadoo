import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true, // Rende la pipe utilizzabile nei componenti standalone
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) {
      return '';
    }

    const pastDate = new Date(value);
    const today = new Date();

    // Resetta l'orario a mezzanotte per un calcolo basato solo sui giorni interi
    const todayMs = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    const pastDateMs = new Date(
      pastDate.getFullYear(),
      pastDate.getMonth(),
      pastDate.getDate()
    ).getTime();

    const oneDay = 1000 * 60 * 60 * 24; // Millisecondi in un giorno

    // Calcola i giorni passati
    const differenceMs = todayMs - pastDateMs;
    const days = Math.floor(differenceMs / oneDay);

    if (days === 0) {
      return 'Oggi';
    } else if (days === 1) {
      return 'Ieri';
    } else if (days < 30) {
      return `${days} giorni fa`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} ${months === 1 ? 'mese' : 'mesi'} fa`;
    } else {
      const years = Math.floor(days / 365);
      return `${years} ${years === 1 ? 'anno' : 'anni'} fa`;
    }
  }
}
