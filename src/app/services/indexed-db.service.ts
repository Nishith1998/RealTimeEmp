import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, Subject } from 'rxjs';
import { take, filter } from 'rxjs/operators';

const VERSION = 1;
const STORAGE_NAME = 'employeeStore';

interface Record {
  key: number;
  name: string;
  role: string;
  fromDate: Date;
  toDate: Date;
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
      const openRequest = indexedDB.open(STORAGE_NAME, VERSION);
      openRequest.onerror = () => onError(openRequest.error);
      openRequest.onsuccess = () => this.db.next(openRequest.result);
      openRequest.onupgradeneeded = () => {
        try {
          const db: IDBDatabase = openRequest.result;
          const surveyCacheStore = db.createObjectStore(STORAGE_NAME, {
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
          const txn = db.transaction([STORAGE_NAME], 'readonly');
          const store = txn.objectStore(STORAGE_NAME);
          const getRequest: IDBRequest<Record> = store.getAll();
          getRequest.onerror = () => onError(getRequest.error);
          getRequest.onsuccess = () => {
            const record = getRequest.result;
            if (
              !record && JSON.stringify(record) === '[]'
            ) {
              observer.error(500);
            } else {
              observer.next(getRequest.result);

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
          const txn = db.transaction([STORAGE_NAME], 'readwrite');
          const store = txn.objectStore(STORAGE_NAME);
          const record: Record = { ...value, key: Date.now() };
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

  delete(keyName: number): Observable<IDBValidKey | null> {
    return Observable.create((observer: Observer<IDBValidKey>) => {
      const onError = (error: any) => {
        console.log(error);
        observer.complete();
      };
      this.$db.subscribe((db: any) => {
        try {
          const txn = db.transaction([STORAGE_NAME], 'readwrite');
          const store = txn.objectStore(STORAGE_NAME);
          // const record: Record = { ...value, key: Date.now() };
          const deleteRequest = store.delete(keyName);
          deleteRequest.onerror = () => onError(deleteRequest.error);
          deleteRequest.onsuccess = () => {
            observer.next(deleteRequest.result);
            observer.complete();
          };
        } catch (err) {
          onError(err);
        }
      });
    });
  }
}
