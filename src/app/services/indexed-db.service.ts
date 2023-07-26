import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, Subject } from 'rxjs';
import { take, filter } from 'rxjs/operators';

const VERSION = 1;
const STORAGENAME = 'employeeStore';

interface Record {
  key: string;
  value: any;
  ttl: number;
  timestamp: number;
}
type RecordInput = Omit<Record, 'timestamp'>;
@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  db = new ReplaySubject<IDBDatabase | null>(1);
  $db = this.db.pipe(
    take(1),
    filter((db) => !!db)
  );

  constructor() {
    const onError = (error: any) => {
      console.log(error);
      this.db.complete();
    };
    if (!window.indexedDB) {
      onError('IndexedDB not available');
    } else {
      const openRequest = indexedDB.open(STORAGENAME, VERSION);
      openRequest.onerror = () => onError(openRequest.error);
      openRequest.onsuccess = () => this.db.next(openRequest.result);
      openRequest.onupgradeneeded = () => {
        try {
          const db: IDBDatabase = openRequest.result;
          const surveyCacheStore = db.createObjectStore(STORAGENAME, {
            keyPath: 'key',
          });
          // surveyCacheStore.createIndex('value', 'value');
          // surveyCacheStore.createIndex('timestamp', 'timestamp');
          // surveyCacheStore.createIndex('ttl', 'ttl');
        } catch (error) {
          onError(error);
        }
      };
    }
  }

  get(): Observable<Record | null> {
    return Observable.create((observer: Observer<Record | 500>) => {
      const onError = (error: any) => {
        console.log(error);
        observer.complete();
      };
      this.$db.subscribe((db: any) => {
        try {
          const txn = db.transaction([STORAGENAME], 'readonly');
          const store = txn.objectStore(STORAGENAME);
          const getRequest: IDBRequest<Record> = store.getAll();
          getRequest.onerror = () => onError(getRequest.error);
          getRequest.onsuccess = () => {
            const record = getRequest.result;
            if (
              !record
            ) {
              observer.next(500);
            } else {
              observer.error(500);

              // observer.next(getRequest.result);
            }
            observer.complete();
          };
        } catch (err) {
          onError(err);
        }
      });
    });
  }

  put(value: RecordInput): Observable<IDBValidKey | null> {
    return Observable.create((observer: Observer<IDBValidKey>) => {
      const onError = (error: any) => {
        console.log(error);
        observer.complete();
      };
      this.$db.subscribe((db: any) => {
        try {
          const txn = db.transaction([STORAGENAME], 'readwrite');
          const store = txn.objectStore(STORAGENAME);
          const record: Record = { ...value, timestamp: Date.now() };
          const putRequest = store.put(record);
          putRequest.onerror = () => onError(putRequest.error);
          putRequest.onsuccess = () => {
            observer.next(putRequest.result);
            observer.complete();
          };
        } catch (err) {
          onError(err);
        }
      });
    });
  }
}
