/* eslint-disable @typescript-eslint/no-explicit-any */
import { instance } from "@/services/api/api";
import { AxiosResponse, AxiosError } from "axios";
import {
  ApiExamResponse,
  Exam,
} from "@/interfaces/ExamInterface/ExamInterface";
import {
  ApiCandidateInFoResponse,
  ApiCandidateResponse,
  ApiCandidateResponse__,
  Candidate,
  CreateCandidate,
} from "@/interfaces/CandidateInterface/CandidateInterface";

type WarningType = string[] | Record<string, string[]> | string | null;

export const formatWarningMessage = (warning: WarningType): string => {
  if (Array.isArray(warning)) {
    return warning.join(", ");
  } else if (typeof warning === "object" && warning !== null) {
    return JSON.stringify(warning);
  } else {
    return String(warning) || "An error occurred";
  }
};

export const getAllWithStatusTrue = async (): Promise<ApiExamResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<Exam[]> = await instance.get(
      "/api/admin/exam/get-all-with-status-true",
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
export const CandidateInExamRoom = async (
  id: string
): Promise<ApiCandidateResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<Candidate[]> = await instance.get(
      `/api/admin/candidate/exam-room/candidate-in-exam-room/${id}`,
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
export const DetailCandidate = async (
  id: string
): Promise<ApiCandidateResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<Candidate[]> = await instance.get(
      `/api/admin/candidate/detail-candidate/${id}`,
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
export const addCandidate = async (data: CreateCandidate) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    const response: AxiosResponse<ApiCandidateResponse> = await instance.post(
      `/api/admin/candidate/store`,
      data,
      {
        headers: headers,
      }
    );

    return {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
      status: 201,
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      console.log(data);
      const errorMessage = formatWarningMessage(data.warning);
      return {
        success: false,
        message: errorMessage,
        data: [],
      };
    } else {
      const generalError =
        "An unknown error occurred while adding exam subject.";

      return {
        success: false,
        message: generalError,
        data: [],
      };
    }
  }
};

export const getExamByIdCode = async (
  id: string,
  code: string
): Promise<ApiCandidateResponse__> => {
  try {
    const token = localStorage.getItem("token");

    const data = {
      id_subject: id,
      idCode: code,
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    const response: AxiosResponse<ApiCandidateResponse__> = await instance.post(
      `/api/client/exam`,
      data,
      {
        headers: headers,
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      console.log(data);
      const errorMessage = formatWarningMessage(data.warning);
      return {
        success: false,
        message: errorMessage,
        status: 500,
      };
    } else {
      const generalError =
        "An unknown error occurred while adding exam subject.";

      return {
        success: false,
        message: generalError,
        status: 500,
      };
    }
  }
};

export const CandidateById = async (
  id: string
): Promise<ApiCandidateInFoResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiCandidateInFoResponse> =
      await instance.get(`/api/client/info/${id}`, {
        headers: headers,
      });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = `${data.message || "Error occurred"}`;

      return {
        success: false,
        message: errorMessage,
        status: 500,
      };
    } else {
      const generalError = "An unknown error occurred while fetching exams.";

      return {
        success: false,
        message: generalError,
        status: 500,
      };
    }
  }
};

export const Update_time = async (
  data: any
): Promise<ApiCandidateInFoResponse> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        message: "No token found",
        status: 401,
      };
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Send data as the second argument, and headers as the third argument
    const response: AxiosResponse<ApiCandidateInFoResponse> = await instance.post(
      `/api/client/update_time`,
      data, // Send data as the body of the POST request
      { headers } // Pass headers as the third argument in the request configuration
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = `${data.message || "Error occurred"}`;

      return {
        success: false,
        message: errorMessage,
        status: 500,
      };
    } else {
      const generalError = "An unknown error occurred while updating the time.";

      return {
        success: false,
        message: generalError,
        status: 500,
      };
    }
  }
};

export const toggleActiveStatus = async (
  exam_subject_id: string,
  idcode: string
) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        message: "Token không tồn tại. Vui lòng đăng nhập.",
      };
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await instance.post(
      "/api/admin/active/toggle",
      {
        exam_subject_id,
        idcode,
      },
      { headers }
    );

    return {
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error toggling active status:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi không xác định",
      error: error.response?.data?.error,
    };
  }
};
export const exportExcelCandidate = async (action?: string, id?: string) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await instance.post(
      "/api/admin/candidate/export-excel-password-candidate",
      { action, id },
      {
        headers,
        responseType: "blob", // Quan trọng để nhận file
      }
    );

    // Tạo file Excel để download
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `danh_sach_ung_vien_${new Date().toISOString()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: "Xuất file Excel thành công",
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      return {
        success: false,
        message: data.message || "Lỗi khi xuất file Excel",
        status: error.response.status,
      };
    }
    return {
      success: false,
      message: "Đã xảy ra lỗi không xác định",
      status: 500,
    };
  }
};
export const importCandidates = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    const response = await instance.post(
      "/api/admin/candidate/import-excel-candidate",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: response.data.success,
      message: response.data.message || "Import thành công",
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Lỗi khi import",
      errors: error.response?.data?.errors,
    };
  }
};
