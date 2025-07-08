import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/landing-page/LandingPage";
import TeacherLandingPage from "./Pages/teacher-landing/TeacherLandingPage";
import StudentLandingPage from "./Pages/student-landing/StudentLandingPage";
import StudentPollPage from "./Pages/student-poll/StudentPollPage";
import TeacherPollPage from "./Pages/teacher-poll/TeacherPollPage";
import PollHistoryPage from "./Pages/poll-history/PollHistory";
import TeacherProtectedRoute from "./components/route-protect/TeacherProtect";
import StudentProtectedRoute from "./components/route-protect/StudentProtect";
import KickedOutPage from "./Pages/kickout-page/KickedOutPage"; // ✅ Import added

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/teacher-home-page"
          element={
            <TeacherProtectedRoute>
              <TeacherLandingPage />
            </TeacherProtectedRoute>
          }
        />

        <Route path="/student-home-page" element={<StudentLandingPage />} />

        <Route
          path="/poll-question"
          element={
            <StudentProtectedRoute>
              <StudentPollPage />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/teacher-poll"
          element={
            <TeacherProtectedRoute>
              <TeacherPollPage />
            </TeacherProtectedRoute>
          }
        />

        <Route
          path="/teacher-poll-history"
          element={
            <TeacherProtectedRoute>
              <PollHistoryPage />
            </TeacherProtectedRoute>
          }
        />

        <Route path="/kicked-out" element={<KickedOutPage />} /> {/* ✅ Added */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
