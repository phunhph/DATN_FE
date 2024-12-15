import { instance } from "@/services/api/api";
import { AxiosResponse, AxiosError } from "axios";

// Interfaces
interface Point {
  subject_name: string;
  point: number;
  correct_answers: number;
  exam_date: string;
}

interface Exam {
  id: string;
  name: string;
  time_start: string;
  time_end: string;
}

interface ExamRoom {
  id: string;
  exam_id: string;
  name: string;
  candidates_count: number;
}

interface Candidate {
  idcode: string;
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
}

// Service functions
export const getStudentPoints = async (
  idcode: string
): Promise<ApiResponse<{ points: Point[]; average_point: number }>> => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await instance.get(`/api/admin/points/student/${idcode}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createPoint = async (pointData: {
  exam_subject_id: string;
  idcode: string;
  point: number;
  number_of_correct_sentences: number;
}): Promise<ApiResponse<Point>> => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await instance.post("/api/admin/points", pointData, {
      headers,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getAllExams = async (): Promise<ApiResponse<Exam[]>> => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await instance.get(
      `/api/admin/exam/get-all-with-status-true`,
      { headers }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getExamRoomsByExam = async (
  examId: string
): Promise<ApiResponse<ExamRoom[]>> => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await instance.get(
      `/api/admin/exam-room/by-exam/${examId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getCandidatesInRoom = async (
  roomId: string
): Promise<ApiResponse<Candidate[]>> => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await instance.get(
      `/api/admin/candidate/exam-room/candidate-in-exam-room/${roomId}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getPointsByExamAndSubject = async (
  exam_id: string,
  subject_id: string
): Promise<ApiResponse<{ points: Point[]; average_point: number }>> => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await instance.get(
      `/api/admin/points/exam/${exam_id}/subject/${subject_id}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getPointsByExamRoom = async (
  exam_room_id: string
): Promise<ApiResponse<{ points: Point[]; average_point: number }>> => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await instance.get(
      `/api/admin/points/exam-room/${exam_room_id}`,
      { headers }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

const handleError = (error: unknown) => {
  if (error instanceof AxiosError && error.response) {
    const { data } = error.response;
    return {
      success: false,
      status: error.response.status,
      message: data.message || "Error occurred",
    };
  }
  return {
    success: false,
    status: 500,
    message: "An unknown error occurred.",
  };
};
export const getStudentPointsByExam = async (
  idcode: string,
  examId: string
): Promise<ApiResponse<{ points: Point[]; average_point: number }>> => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await instance.get(
      `/api/admin/points/student/${idcode}/exam/${examId}`,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
export const getReportByExam = async (
  examId: string
)=> {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await instance.get(
      `/api/admin/reports/byExam/${examId}`,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return handleError(error);
  }
};
export const getReportBySubject = async (
  examId: string,
  subjectId:string
)=> {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await instance.get(
      `api/admin/reports/bySubject/${examId}/subject/${subjectId}`,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return handleError(error);
  }
};
export const getReportByRoom = async (
  examId: string,
  roomId: string
)=> {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const response = await instance.get(
      `api/admin/reports/byRoom/${examId}/room/${roomId}`,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return handleError(error);
  }
};
export default {
  getStudentPoints,
  createPoint,
  getPointsByExamAndSubject,
  getPointsByExamRoom,
  getAllExams,
  getExamRoomsByExam,
  getCandidatesInRoom,
  getStudentPointsByExam,
};
