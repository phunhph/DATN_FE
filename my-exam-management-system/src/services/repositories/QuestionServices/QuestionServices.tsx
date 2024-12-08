import {
  ApiQuestionDetailResponse,
  ApiQuestionResponse,
  Question,
} from "@/interfaces/QuestionInterface/QuestionInterface";
import { instance } from "@/services/api/api";
import { AxiosResponse, AxiosError } from "axios";

export const getAllQuestionByIdContent = async (
  id: string
): Promise<ApiQuestionResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiQuestionResponse> = await instance.get(
      `/api/admin/questions/exam-content/${id}`,
      {
        headers: headers,
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = formatWarningMessage(data.warning || data.message);

      return {
        success: false,
        message: errorMessage,
        status: "500",
        data: [],
      };
    } else {
      const generalError =
        "An unknown error occurred while fetching exam subjects.";

      return {
        success: false,
        message: generalError,
        status: "500",
        data: [],
      };
    }
  }
};

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

export const updateStatusQuestion = async (id: string) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiQuestionResponse> = await instance.put(
      `/api/admin/questions/status/${id}`,
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

export const createQuestion = async (data: Question) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiQuestionResponse> = await instance.post(
      `/api/admin/questions`,
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

export const getQuestionById = async (
  id: string
): Promise<ApiQuestionDetailResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiQuestionDetailResponse> =
      await instance.get(`/api/admin/questions/${id}`, {
        headers: headers,
      });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = formatWarningMessage(data.warning || data.message);

      return {
        success: false,
        message: errorMessage,
        status: 500,
      };
    } else {
      const generalError =
        "An unknown error occurred while fetching exam subjects.";

      return {
        success: false,
        message: generalError,
        status: 500,
      };
    }
  }
};

export const updateQuestion = async (data: Question) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiQuestionResponse> = await instance.put(
      `/api/admin/questions/${data.id}`,
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
// services/QuestionServices.ts
export const exportQuestions = async (exam_content_id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.post(
      "/api/admin/questions/export-excel",
      { exam_content_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `danh_sach_cau_hoi_${new Date().toISOString()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: "Xuất file Excel thành công",
    };
  } catch (error) {
    return {
      success: false,
      message: "Đã xảy ra lỗi khi xuất file",
    };
  }
};

export const importQuestions = async (file: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.post(
      "/api/admin/questions/import-excel",
      file,
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
  } catch (error) {
    return {
      success: false,
      message: "Lỗi khi import",
    };
  }
};
