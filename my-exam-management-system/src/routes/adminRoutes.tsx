// adminRoutes.js
import ManageExamRoomDetail from "@/modules/admin/ManageExamRooms/ManageExamRoomDetail";
import {
    Welcome,
    ManageCandidates,
    ManageENExamStructure,
    ManageENQuestions,
    ManageExamRooms,
    ManageExamSessions,
    ManageExamState_Candidates,
    ManageExamState_Rooms,
    ManageListenings,
    ManageQuestions,
    ManageReadings,
    ManageReports,
    ManageSupervisors,
    Subject,
    ExamContent,
    DetailSupervisor,
    ManageSemester,
    DetailCandidates,
    QuestionDetail,
    ExamResults,
    ManageStatus,
    AdminPage
  } from "../modules/admin/index";
  
  const adminRoutes = [
    { path: "", element: <Welcome /> },
    { path: "manage-semester", element: <ManageSemester /> },
    { path: "manage-candidates", element: <ManageCandidates /> },
    { path: "detail-candidates", element: <DetailCandidates /> },
    { path: "exam-results", element: <ExamResults /> },
    { path: "manage-en-exam-structure", element: <ManageENExamStructure /> },
    { path: "manage-en-questions", element: <ManageENQuestions /> },
    { path: "manage-status", element: <ManageStatus /> },
    { path: "manage-exam-rooms", element: <ManageExamRooms /> },
    { path: "detail-exam-rooms", element: <ManageExamRoomDetail /> },
    { path: "manage-exam-sessions", element: <ManageExamSessions /> },
    { path: "manage-exam-state-candidates", element: <ManageExamState_Candidates /> },
    { path: "manage-exam-state-rooms", element: <ManageExamState_Rooms /> },
    { path: "manage-listenings", element: <ManageListenings /> },
    { path: "manage-questions", element: <ManageQuestions /> },
    { path: "detail-questions", element: <QuestionDetail /> },
    { path: "manage-readings", element: <ManageReadings /> },
    { path: "manage-reports", element: <ManageReports /> },
    { path: "manage-supervisors", element: <ManageSupervisors /> },
    { path: "detail-supervisors", element: <DetailSupervisor /> },
    { path: "subject", element: <Subject /> },
    { path: "exam-content", element: <ExamContent /> },
    { path: "user", element: <AdminPage /> },

  ];
  
  export default adminRoutes;
  