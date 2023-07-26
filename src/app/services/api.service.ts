import { Injectable } from '@angular/core';
import { from } from 'rxjs';
declare var db: any;

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  storagename = 'employeeStore';

  constructor() {}

  add(value: any) {
    return from(new Promise(async (resolve, reject) => {
      if (db !== undefined) {
        const request = await db
          .transaction([this.storagename], 'readwrite')
          .objectStore(this.storagename)
          .put({...value, key: Date.now()}, Date.now());
        request.onsuccess = await function (event: any) {
          if (event.target.result) {
            resolve(200);
          } else {
            reject(500);
          }
        };
      }
    }));
  }

  getAll() {
    return from(new Promise(async (resolve, reject) => {
      if (db !== undefined) {
        const request = await db
          .transaction([this.storagename], 'readwrite')
          .objectStore(this.storagename)
          .getAll();
        request.onsuccess = await function (event: any) {
          if (event.target.result) {
            resolve(event.target.result);
          } else {
            reject(500);
          }
        };
      }
    }));
  }

  delete(keyname: string) {
    return from(new Promise(async (resolve, reject) => {
      if (db !== undefined) {
        const request = await db
          .transaction([this.storagename], 'readwrite')
          .objectStore(this.storagename)
          .delete(keyname);
        request.onsuccess = await function (event: any) {
          if (event.target.result) {
            resolve(200);
          } else {
            reject(500);
          }
        };
      }
    }));
  }
}
