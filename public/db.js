window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;

let db;
// create indexDB
const request = window.indexedDB.open("budgetDB", 1);

// create a object store
request.onupgradeneeded = ({ target }) => {
  let db = target.result;
  let objectStore = db.createObjectStore("budgetStore", {
    autoIncrement: true,
  });
};

request.onsuccess = ({ target }) => {
  db = target.result;

  // check if the application is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log(
    "There has been an error with retrieving your data: " +
      event.target.errorCode
  );
};
