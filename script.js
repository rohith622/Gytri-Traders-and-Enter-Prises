// script.js

// Import Firebase modules (using CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// ✅ Step 1: Add your Firebase project configuration here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// ✅ Step 2: Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Step 3: Fetch pesticide records from Firestore
async function fetchPesticides() {
  const list = document.getElementById("pesticide-list");
  list.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "pesticides"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${data.name}</h3>
      <p>Category: ${data.category}</p>
      <p>Price: ₹${data.price}</p>
      <p>Quantity: ${data.quantity}</p>
      <hr>
    `;
    list.appendChild(div);
  });
}

// ✅ Step 4: Add pesticide to Firestore
document.getElementById("addPesticideForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("pesticideName").value;
  const category = document.getElementById("category").value;
  const price = parseFloat(document.getElementById("price").value);
  const quantity = parseInt(document.getElementById("quantity").value);

  try {
    await addDoc(collection(db, "pesticides"), {
      name,
      category,
      price,
      quantity
    });
    alert("✅ Pesticide Added Successfully!");
    document.getElementById("addPesticideForm").reset();
    fetchPesticides();
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});

// ✅ Step 5: Search pesticides
window.searchPesticide = function () {
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const items = document.querySelectorAll("#pesticide-list > div");

  items.forEach((item) => {
    const title = item.querySelector("h3").innerText.toLowerCase();
    item.style.display = title.includes(searchText) ? "block" : "none";
  });
};

// ✅ Initial fetch
fetchPesticides();

import { onSnapshot, collection } from "firebase/firestore";

// Real-time listener to fetch orders
onSnapshot(collection(db, "orders"), (snapshot) => {
  const tableBody = document.getElementById("ordersTableBody");
  tableBody.innerHTML = ""; // Clear table before rendering new data

  snapshot.forEach((doc) => {
    const order = doc.data();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.name}</td>
      <td>${order.address}</td>
      <td>${order.pesticide}</td>
      <td>${order.quantity}</td>
      <td>${order.status}</td>
    `;
    tableBody.appendChild(row);
  });
});
