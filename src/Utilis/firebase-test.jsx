import { useState, useEffect } from "react";
import "./App.css";
// import { articles } from './Utilis/firebase'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  getFirestore,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH2xJnYw9TtWMXbJZbM4za79APCKIyIJE",
  authDomain: "fir-practice-362bd.firebaseapp.com",
  projectId: "fir-practice-362bd",
  storageBucket: "fir-practice-362bd.appspot.com",
  messagingSenderId: "48738027317",
  appId: "1:48738027317:web:cfab3e4133e928747b6e7c",
  measurementId: "G-TGELL92E4F",
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore();

// collection ref
const colRef = collection(db, "books");

// queries
const q = query(colRef, orderBy("createdAt"));

// real time collection data
async function getBooks() {
  let snapshot = await getDocs(q);
  let data = snapshot.docs;
  if (data) {
    let books = [];
    data.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });
    return books;
  } else {
    throw new Error("no books");
  }
}

let books = await getBooks();

// get single document
const docRef = doc(db, "books", "FFnq5VzZoDwjzwRhpaIt");

// getDoc(docRef).then((doc) => console.log(doc.data(), doc.id));

// getting realtime single document
onSnapshot(docRef, (doc) => console.log(doc.data(), doc.id));

function App() {
  let [displayedBooks, setDisplayedBooks] = useState(books);
  let [docs, setDocs] = useState({
    title: "",
    author: "",
    id: "",
    updateId: "",
  });

  onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });

    setDisplayedBooks(books);
  });

  const handleChange = (e) => {
    let { value, name } = e.target;

    setDocs({
      ...docs,
      [name]: value,
    });
  };

  const addDocument = (e) => {
    e.preventDefault();

    addDoc(colRef, {
      title: docs.title,
      author: docs.author,
      createdAt: serverTimestamp(),
    }).then(
      setDocs({
        title: "",
        author: "",
      })
    );
  };

  const deleteDocument = (e) => {
    e.preventDefault();

    const docRef = doc(db, "books", docs.id);
    deleteDoc(docRef).then(
      setDocs({
        ...docs,
        id: "",
      })
    );
  };

  const updateDocument = (e) => {
    e.preventDefault();
    const docRef = doc(db, "books", docs.updateId);
    updateDoc(docRef, {
      title: "updated title",
    }).then(
      setDocs({
        ...docs,
        updateId: "",
      })
    );
  };

  if (displayedBooks) {
    return (
      <>
        <ul>
          {displayedBooks.map((book) => {
            return <li key={book.id}>{`${book.title} ${book.author}`}</li>;
          })}
        </ul>

        <form onSubmit={addDocument}>
          <label htmlFor='title'>Title: </label>
          <input
            type='text'
            name='title'
            value={docs.title}
            onChange={handleChange}
          />
          <label htmlFor='author'>Author: </label>
          <input
            type='text'
            name='author'
            value={docs.author}
            onChange={handleChange}
          />

          <button type='submit'>add</button>
        </form>

        <form onSubmit={deleteDocument}>
          <label htmlFor='id'>document id: </label>
          <input
            type='text'
            name='id'
            value={docs.id}
            onChange={handleChange}
            required
          />

          <button type='submit'>delete a book</button>
        </form>

        <form onSubmit={updateDocument}>
          <label htmlFor='update'>update id: </label>
          <input
            type='text'
            name='updateId'
            id='updateId'
            value={docs.updateId}
            onChange={handleChange}
          />
        </form>
      </>
    );
  }
}

export default App;
