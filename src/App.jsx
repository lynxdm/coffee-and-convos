import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Notifications from "./pages/Notifications";
import New from "./pages/New";
import Article from "./pages/Article";
import Login from "./pages/Login";
import Error from "./pages/Error";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Editor from "./pages/Editor";
import Preview from "./pages/Preview";
import Drafts from "./pages/Drafts";
import NewNotifications from "./pages/NewNotifications";
import ReadNotifications from "./pages/ReadNotifications";
import { Toaster } from "sonner";
import { useGlobalContext } from "./context";

function App() {
  const { theme } = useGlobalContext();

  return (
    <Router>
      <Toaster position='top-right' richColors theme={theme} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/about' element={<About />} />
        <Route path='/notifications' element={<Notifications />}>
          <Route path='' element={<NewNotifications />} />
          <Route path='read' element={<ReadNotifications />} />
        </Route>
        <Route path='/login' element={<Login />}>
          <Route path='' element={<SignIn />} />
          <Route path='signup' element={<SignUp />} />
        </Route>
        <Route path='/drafts' element={<Drafts />} />
        <Route path='/new' element={<New />}>
          <Route path='' element={<Editor />} />
          <Route path='preview' element={<Preview />} />
        </Route>
        <Route path='blog/:id' element={<Article />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
