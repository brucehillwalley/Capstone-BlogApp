import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Blogs from "./pages/Blogs";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import CreateActivity from "./pages/CreateActivity";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import UpdateActivity from "./pages/UpdateActivity";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
           {/* Login olan her kullanıcı post yapabilsin */}
          <Route path="/create-activity" element={<CreateActivity />} />
          <Route path="/update-activity/:postId" element={<UpdateActivity />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          {/* <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} /> */}
        </Route>
        <Route path="/blogs" element={<Blogs />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
