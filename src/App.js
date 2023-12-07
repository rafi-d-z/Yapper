import Auth from "./pages/Auth";
import LayoutPage from "./pages/Layout";
import Feed from "./pages/Feed";
import CorporatePage from "./pages/Corporate";
import Jobs from "./pages/Jobs";
import SearchResults from "./pages/SearchResults";
import PostPage from "./pages/Post";
import { Routes, Route } from 'react-router-dom';
import Loading from "./components/Loading";
import Trending from "./components/trending";
import Taboo from "./pages/Taboo";
import Requests from "./pages/Requests";

function App() {
  return (
    <Routes>
          <Route path='/' element={<LayoutPage />}>
            <Route index element={<Feed />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="corp" element={<CorporatePage />} />
            <Route path="Trending" element={<Trending />} />
            <Route path="searchResults" element={<SearchResults />} />
            <Route path="post" element={<PostPage />} />
            <Route path="loading" element={<Loading />} />
            <Route path="rules" element={<Taboo />} />
            <Route path="accountRequests" element={<Requests />} />
            {/* <Route path="*" element={<NoPage />} /> */}
          </Route>
          <Route path="/auth" element={<Auth />} />
      </Routes>
  );
}

export default App;
