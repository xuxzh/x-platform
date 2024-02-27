import { Platform } from '@angular/cdk/platform';
import { RhSafeAny } from '../../model/any.model';
import { XIsString } from '../interface/data.type';
import { Injectable } from '@angular/core';
import localforage from 'localforage';

@Injectable({ providedIn: 'root' })
export class StorageService {
  storage = localforage;
  constructor(private platform: Platform) {
    //
  }

  getLocal(key: string) {
    if (this.platform.isBrowser) {
      const str = this.storage.getItem(key);
      try {
        return JSON.parse(key || 'null') || null;
      } catch (error) {
        return str;
      }
    } else {
      return null;
    }
  }

  setLocal(key: string, value: RhSafeAny) {
    if (this.platform.isBrowser) {
      XIsString(value)
        ? this.storage.setItem(key, value)
        : this.storage.setItem(key, JSON.stringify(value));
    }
  }
}
