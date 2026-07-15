import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import DashboardScreen from './screens/DashboardScreen';
import ContentScreen from './screens/ContentScreen';
import BatchesAdmin from './screens/content/BatchesAdmin';
import StudyNotesAdmin from './screens/content/StudyNotesAdmin';
import MockTestsAdmin from './screens/content/MockTestsAdmin';
import InterviewPrepAdmin from './screens/content/InterviewPrepAdmin';
import PyqsAdmin from './screens/content/PyqsAdmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
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
  );
}

export default App;
