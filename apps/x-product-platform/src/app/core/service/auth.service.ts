import { Injectable, effect, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  storage = inject(StorageService);
  localStorage = Injectable;
  accessToken = signal(this.storage.getLocal('accessToken'));
  refreshToken = signal(this.storage.getLocal('refreshToken'));
  constructor() {
    effect(() => {
      this.storage.setLocal('accessToken', this.accessToken());
    });
    effect(() => {
      this.storage.setLocal('refreshToken', this.refreshToken());
    });
  }
}
