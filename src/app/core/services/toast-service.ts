import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);

  success(summaryKey: string, detailKey: string, life = 3000) {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant(summaryKey),
      detail: this.translate.instant(detailKey),
      life,
    });
  }

  error(summaryKey: string, detailKey: string, life = 2000) {
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant(summaryKey),
      detail: this.translate.instant(detailKey),
      life,
    });
  }
}
