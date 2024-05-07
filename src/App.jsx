import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Notifications from "./pages/Notifications";
import Editor from "./pages/Editor";
import Article from "./pages/Article";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Blog />} />
        <Route path='/about' element={<About />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/signIn' element={<SignIn />} />
        <Route path='/editor' element={<Editor />} />
        <Route path='/:id' element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
