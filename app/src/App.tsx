import React from "react";
import "./App.css";
import {Route, Routes} from "react-router-dom";
import BooksList from "./components/Book/BooksList";
import AuthorsList from "./components/Author/AuthorsList";
import TagsList from "./components/Tags/TagsList";

const App: React.FC = () => {
  return (
      <div id="main">
          <Routes>
              <Route path="/" element={<BooksList/>} />
              <Route path="/books" element={<BooksList/>} />
              <Route path="/authors" element={<AuthorsList/>} />
              <Route path="/tags" element={<TagsList/>} />
          </Routes>
      </div>
  );
}

export default App;
