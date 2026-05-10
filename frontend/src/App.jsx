import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ClaimNew from './pages/ClaimNew';
import Claims from './pages/Claims';
import Documents from './pages/Documents';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 max-w-lg mx-auto pb-20">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/claim/new"  element={<ClaimNew />} />
          <Route path="/claims"     element={<Claims />} />
          <Route path="/documents"  element={<Documents />} />
          <Route path="/settings"   element={<Settings />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
