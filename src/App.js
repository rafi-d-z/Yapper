import Auth from "./pages/Auth";
import LayoutPage from "./pages/Layout";
import Feed from "./pages/Feed";
import CorporatePage from "./pages/Corporate";
import Jobs from "./pages/Jobs";
import SearchResults from "./pages/SearchResults";
import { Routes, Route } from 'react-router-dom';
import Loading from "./components/Loading";

function App() {
  return (
    <Routes>
          <Route path='/' element={<LayoutPage />}>
            <Route index element={<Feed />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="corp" element={<CorporatePage />} />
            <Route path="searchResults" element={<SearchResults />} />
            <Route path="loading" element={<Loading />} />
            {/* <Route path="*" element={<NoPage />} /> */}
          </Route>
          <Route path="/auth" element={<Auth />} />
      </Routes>
  );
}

export default App;
