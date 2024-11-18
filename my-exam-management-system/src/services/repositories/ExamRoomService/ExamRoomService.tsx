/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse, AxiosError } from "axios";

import {
  ApiExamRoomDetail,
  ApiExamRoomResponse,
  ExamRoom,
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

export const editExamRoom = async (id: any, updatedData: ExamRoom) => {
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
      message: "Token không tồn tại. Vui lòng đăng nhập.",
    };
  }

  try {
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
};

