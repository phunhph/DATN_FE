/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse, AxiosError } from "axios";

import {
  ApiExamRoomDetail,
  ApiExamRoomResponse,
  ExamRoom,
  ExamRoomAPIUpdate,
} from "@interfaces/ExamRoomInterfaces/ExamRoomInterfaces";
import { instance } from "@/services/api/api";

export const getAllExamRooms = async (): Promise<ApiExamRoomResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ExamRoom[]> = await instance.get(
      "/api/admin/exam-room",
      {
        headers: headers,
      }
    );

    return {
      success: true,
      message: "Exam rooms fetched successfully",
      data: response.data,
      status: 200,
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = `${data.message || "Error occurred"}`;

      return {
        success: false,
        message: errorMessage,
        data: [],
        status: 500,
      };
    } else {
      const generalError =
        "An unknown error occurred while fetching exam rooms.";

      return {
        success: false,
        message: generalError,
        data: [],
        status: 500,
      };
    }
  }
};

export const getExamRoom = async (id: any) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      success: false,
      message: "Token không tồn tại. Vui lòng đăng nhập.",
    };
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiExamRoomResponse> = await instance.get(
      `/api/admin/exam-room/${id}`,
      {
        headers: headers,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching exam room detail:", error);
    return {
      success: false,
      message: error.response
        ? error.response.data.message
        : "Lỗi không xác định",
    };
  }
};

export const editExamRoom = async (id: any, updatedData: ExamRoomAPIUpdate) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      success: false,
      message: "Token không tồn tại. Vui lòng đăng nhập.",
    };
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ExamRoom> = await instance.put(
      `/api/admin/exam-room/${id}`,

      updatedData,
      {
        headers: headers,
      }
    );

    return {
      success: true,
      message: "Exam room updated successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error updating exam room:", error);
    return {
      success: false,
      message: error.response
        ? error.response.data.message
        : "Lỗi không xác định khi cập nhật phòng thi.",
    };
  }
};

export const getExamRoomsInExams = async (
  id: string
): Promise<ApiExamRoomResponse> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        data: [],
        status: 404,
        message: "Token không tồn tại. Vui lòng đăng nhập.",
      };
    }
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ExamRoom[]> = await instance.get(
      `/api/admin/exam/exam-rooms-in-exams/${id}`,
      {
        headers: headers,
      }
    );

    return {
      success: true,
      message: "Exams fetched successfully",
      data: response.data,
      status: 200,
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      // const { data } = error.response;
      // const errorMessage = `${data.message || "Error occurred"}`;

      return {
        success: false,
        message: "Token không tồn tại. Vui lòng đăng nhập.",
        data: [],
        status: 401,
      };
    }

    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response: AxiosResponse<ExamRoom[]> = await instance.get(
        `/api/admin/exam/exam-rooms-in-exams/${id}`,
        {
          headers: headers,
        }
      );

      return {
        success: true,
        message: "Exams fetched successfully",
        data: response.data,
        status: 200,
      };
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const { data } = error.response;
        const errorMessage = `${data.message || "Error occurred"}`;

        return {
          success: false,
          message: errorMessage,
          data: [],
          status: 500,
        };
      } else {
        const generalError = "An unknown error occurred while fetching exams.";

        return {
          success: false,
          message: generalError,
          data: [],
          status: 500,
        };
      }
    }
  }
};

export const getExamRoomDetail = async (id: any) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      success: false,
      message: "Token không tồn tại. Vui lòng đăng nhập.",
    };
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiExamRoomDetail> = await instance.get(
      `/api/admin/exam-room/detail/${id}`,
      {
        headers: headers,
      }
    );

    return {
      success: response.data.success,
      message: response.data.message,
      data: {
        examRoom: response.data.data.examRoom,
        exam_room_details: response.data.data.exam_room_details,
        exam_sessions: response.data.data.exam_sessions,
        exam_subjects: response.data.data.exam_subjects,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response
        ? error.response.data.message
        : "Lỗi không xác định",
    };
  }
};

export const getDataSelectUpdate = async (
  room: any,
  exam_subject_id: string
) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {
      success: false,
      message: "Token không tồn tại. Vui lòng đăng nhập.",
    };
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await instance.get(
      `/api/admin/exam-room/data-select-update/${room.id}/${exam_subject_id}`,
      { headers }
    );

    // Format lại data theo cấu trúc formData để hiển thị đúng trong form
    let examDate = "";
    let examEnd = "";

    if (response.data.data.exam_date) {
      examDate = formatLocalDate(response.data.data.exam_date);
    }

    if (response.data.data.exam_end) {
      examEnd = formatLocalDate(response.data.data.exam_end);
    }

    return {
      success: response.data.success,
      data: {
        exam_room: {
          id: room.id,
          exam_id: room.exam_id,
          name: room.name,
          exam_room_detail: {
            id: "",
            exam_room_id: room.id,
            exam_session_id: response.data.data.exam_session?.id || "",
            exam_date: examDate,
            exam_end: examEnd,
            exam_subject_id: exam_subject_id,
          },
        },
        exam_sessions: response.data.data.exam_session
          ? [response.data.data.exam_session]
          : [],
      },
    };
  } catch (error: any) {
    console.error("Error in getDataSelectUpdate:", error);
    return {
      success: false,
      message: error.response?.data.message || "Lỗi không xác định",
    };
  }
};

// Helper function to convert date string to local date format (YYYY-MM-DD)
function formatLocalDate(dateStr: string): string {
  const date = new Date(dateStr); // Parse the date string into a Date object
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Adjust to local time
  return localDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}
