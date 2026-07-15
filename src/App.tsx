import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './screens/LoginScreen';
import AdminLayout from './components/AdminLayout';
import DashboardScreen from './screens/DashboardScreen';
import ContentScreen from './screens/ContentScreen';
import BatchesAdmin from './screens/content/BatchesAdmin';
import StudyNotesAdmin from './screens/content/StudyNotesAdmin';
import MockTestsAdmin from './screens/content/MockTestsAdmin';
import InterviewPrepAdmin from './screens/content/InterviewPrepAdmin';
import PyqsAdmin from './screens/content/PyqsAdmin';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  if (!isAdmin) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardScreen />} />
          <Route path="students" element={<div className="p-8 text-2xl font-bold">Students Placeholder</div>} />
          <Route path="content" element={<ContentScreen />} />
          <Route path="content/batches" element={<BatchesAdmin />} />
          <Route path="content/study-notes" element={<StudyNotesAdmin />} />
          <Route path="content/mock-tests" element={<MockTestsAdmin />} />
          <Route path="content/interview-prep" element={<InterviewPrepAdmin />} />
          <Route path="content/pyqs" element={<PyqsAdmin />} />
          <Route path="settings" element={<div className="p-8 text-2xl font-bold">Settings Placeholder</div>} />
        </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
