import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Diary from './pages/Diary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Diary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
