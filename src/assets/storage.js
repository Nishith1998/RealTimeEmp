// window.indexedDB = window.indexedDB

// window.IDBTransaction = window.IDBTransaction

// window.IDBKeyRange = window.IDBKeyRange

if(!window.indexedDB) {
    alert("Your browser is not supporting indexDB");
}

let db;

let request = window.indexedDB.open("employeeStore", 1);

request.onerror = (event) => {
    console.log("error in request: ", event);
}

request.onsuccess = (event) => {
    db = request.result;
    console.log("Success in request: ", event);
}

request.onupgradeneeded = (event) => {
    let db = event.target.result;
    let objectStore = db.createObjectStore("employeeStore")
}