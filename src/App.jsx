import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Notifications from "./pages/Notifications";
import Editor from "./pages/Editor";
import Article from "./pages/Article";
import Login from "./pages/Login";
import Error from "./pages/Error";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Blog />} />
        <Route path='/about' element={<About />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/login' element={<Login />}>
          <Route path='' element={<SignIn />} />
          <Route path='signup' element={<SignUp />} />
        </Route>
        <Route path='/editor' element={<Editor />} />
        <Route path='/:id' element={<Article />} />
        <Route path='*' element={<Error />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
