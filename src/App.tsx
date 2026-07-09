import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import DashboardScreen from './screens/DashboardScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<DashboardScreen />} />
          <Route path="students" element={<div className="p-8 text-2xl font-bold">Students Placeholder</div>} />
          <Route path="content" element={<div className="p-8 text-2xl font-bold">Content Placeholder</div>} />
          <Route path="settings" element={<div className="p-8 text-2xl font-bold">Settings Placeholder</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
