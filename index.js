import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
  databaseURL: process.env.DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInDB = ref(database, "leads");

const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const messageEl = document.getElementById("message-el");

function render(leads) {
  if (leads.length === 0) {
    ulEl.style.display = "none";
    messageEl.style.display = "block";
  } else {
    ulEl.style.display = "block";
    messageEl.style.display = "none";
    let listItems = "";
    for (let i = 0; i < leads.length; i++) {
      listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
  }
}

onValue(referenceInDB, function (snapshot) {
  const snapshotDoesExist = snapshot.exists();
  if (snapshotDoesExist) {
    const snapshotValues = snapshot.val();
    const leads = Object.values(snapshotValues);
    render(leads);
  } else {
    render([]);
  }
});

deleteBtn.addEventListener("dblclick", function () {
  remove(referenceInDB);
  ulEl.innerHTML = "";
  render([]);
});

inputBtn.addEventListener("click", function () {
  const inputValue = inputEl.value.trim();
  if (inputValue) {
    push(referenceInDB, inputValue);
    inputEl.value = "";
  }
});
