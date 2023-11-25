import Auth from "./pages/Auth";
import LayoutPage from "./pages/Layout";
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
          <Route path='/' element={<LayoutPage />} />
          <Route path="/auth" element={<Auth />} />
      </Routes>
  );
}

export default App;
