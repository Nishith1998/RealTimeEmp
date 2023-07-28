import { Injectable } from '@angular/core';
import { Observable, Observer, ReplaySubject, Subject } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { EmployeeDetails } from 'src/app/model';

const VERSION = 1;
const STORAGE_NAME = 'employeeStore';

interface Record {
  key?: number;
  name: string;
  role: string;
  fromDate: string;
  toDate: string;
}
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
          db.createObjectStore(STORAGE_NAME, {
            keyPath: 'key',
          });
        } catch (error) {
          onError(error);
        }
      };
    }
  }

  get(): Observable<EmployeeDetails[]> {
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
              !record
            ) {
              observer.error(500);
            } else {
              observer.next(getRequest.result);

            }
            observer.complete();
          };
        } catch (err) {
          onError(err);
        }
      });
    });
  }

  getByKey(keyName: number): Observable<Record> {
    return Observable.create((observer: Observer<Record | 500>) => {
      const onError = (error: any) => {
        console.log(error);
        observer.complete();
      };
      this.$db.subscribe((db: any) => {
        try {
          const txn = db.transaction([STORAGE_NAME], 'readonly');
          const store = txn.objectStore(STORAGE_NAME);
          const getRequest: IDBRequest<Record> = store.get(keyName);
          getRequest.onerror = () => onError(getRequest.error);
          getRequest.onsuccess = () => {
            const record = getRequest.result;
            if (
              !record
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

  put(key: number, value: EmployeeDetails): Observable<IDBValidKey | null> {
    return Observable.create((observer: Observer<IDBValidKey>) => {
      const onError = (error: any) => {
        console.log(error);
        observer.complete();
      };
      this.$db.subscribe((db: any) => {
        try {
          const txn = db.transaction([STORAGE_NAME], 'readwrite');
          const store = txn.objectStore(STORAGE_NAME);
          const record: Record = { ...value, key: key };
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
