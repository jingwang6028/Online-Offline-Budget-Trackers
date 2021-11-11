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
    console.log("Backend Online Now!");
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log(
    "There has been an error with retrieving your data: " +
      event.target.errorCode
  );
};

function checkDatabase() {
  const transaction = db.transaction(["budgetStore", "readwrite"]);
  const store = transaction.objectStore("budgetStore");
  const getAll = store.getAll();

  // if the request was successful
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*,",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(() => {
          // delete record if successful
          const transaction = db.transaction(["budgetStore"], "readwrite");
          const store = transaction.objectStore("budgetStore");
          store.clear();
        });
    }
  };
}

function saveRecord(record) {
  const transaction = db.transaction(["budgetStore"], "readwrite");
  const store = transaction.objectStore("budgetStore");
  store.add(record);
}

window.addEventListener("online", checkDatabase);
