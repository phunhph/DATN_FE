// clientRoutes.js
import { Navigate } from "react-router-dom";
import { Home, Scores, History, Subject, CandidateInformation, DetailedResult, Exam, Reading, Listening } from "../modules/client/index";

const clientRoutes = [
  { path: "", element: <Navigate to="/client/home" replace /> },
  {
    path: "home",
    element: <Home />
  },
  {
    path: "subject",
    element: <Subject />
  },
  {
    path: "scores",
    element: <Scores />
  },
  {
    path: "history",
    element: <History />
  },
  {
    path: "candidate-information",
    element: <CandidateInformation />
  },
  {
    path: "detailed-result",
    element: <DetailedResult />
  },
  {
    path: "exam",
    element: <Exam />
  },
  {
    path: "reading",
    element: <Reading />
  },
  {
    path: "listening",
    element: <Listening />
  }
];

export default clientRoutes;
