import Auth from "./pages/Auth";
import LayoutPage from "./pages/Layout";
import Feed from "./components/Feed";
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LayoutPage />} />
      <Route path='/feed' element={<Feed />} /> 
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
