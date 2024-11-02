
import { instance } from "@/services/api/api";
import { ApiExamContentResponse, ExamContentCreate, ExamContentInterface } from "@/interfaces/ExamContentInterface/ExamContentInterface";
import { AxiosResponse, AxiosError } from "axios";

export const getAllExamContentByIdSubject = async (
  id: string
) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiExamContentResponse> = await instance.get(
      `/api/admin/exam-content/exam-subject/${id}`,
      {
        headers: headers,
      }
    );

    return {
        success: response.data.success,
        message: "Content fetched successfully",
        data: response.data.data,
        status: 200
      }; 
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = formatWarningMessage(data.warning||data.message);

      return {
        success: false,
        message: errorMessage,
        data: [],
      };
    } else {
      const generalError =
        "An unknown error occurred while fetching exam subjects.";

      return {
        success: false,
        message: generalError,
        data: [],
      };
    }
  }
};

export const addExamContent = async (data: ExamContentCreate) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiExamContentResponse> = await instance.post(
      `/api/admin/exam-content`,
      data,
      {
        headers: headers,
      }
    );

    return  {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
      status: 201
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

export const updateExamContent = async (data: ExamContentInterface) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log(data);
    
    const response: AxiosResponse<ApiExamContentResponse> = await instance.put(
      `/api/admin/exam-content/${data.id}`,
      data,
      {
        headers: headers,
      }
    );

    return  {
      success: response.data.success,
      message: response.data.message,
      data: response.data.data,
      status: 200
    };
  } catch (error) {
    
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
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

export const updateStatuContent = async (id: string) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiExamContentResponse> = await instance.put(
      `/api/admin/exam-content/status/${id}`,
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

export const importFileExcelContent = async (file: FormData) => {
  try {
    const token = localStorage.getItem("token");
    
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const response: AxiosResponse<ApiExamContentResponse> = await instance.post(
      `/api/admin/exam-content/import-excel-exam-content`,
      file, 
      {
        headers:headers
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      console.log(data);
      const errorMessage = formatWarningMessage_(data.warning||data.message);
      return {
        success: false,
        message: errorMessage,
        data: [],
      };
    } else {
      const generalError = "An unknown error occurred while adding exam subject.";
      return {
        success: false,
        message: generalError,
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

export const formatWarningMessage_ = (warning: WarningType): string => {
  const errorMessagesMap: Record<number, Set<string>> = {}; 
  if (Array.isArray(warning)) {
    return Object.entries(warning)
      .map(([key, errors]) => {
        const rowIndex = parseInt(key) + 1; 
        if (!errorMessagesMap[rowIndex]) {
          errorMessagesMap[rowIndex] = new Set(); 
        }

        if (Array.isArray(errors)) {
          errors.forEach((error) => {
            errorMessagesMap[rowIndex].add(`Lỗi: ${error}`);
          });
        } else {
          errorMessagesMap[rowIndex].add(`Lỗi: ${String(errors)}`);
        }

        return `Hàng ${rowIndex}: ${Array.from(errorMessagesMap[rowIndex]).join(' ')}`;
      })
      .join("\n");
  } else if (typeof warning === "object" && warning !== null) {
    return Object.entries(warning)
      .map(([key, errors]) => {
        if (!errorMessagesMap[parseInt(key) + 1]) {
          errorMessagesMap[parseInt(key) + 1] = new Set();
        }

        if (Array.isArray(errors)) {
          errors.forEach((error) => {
            errorMessagesMap[parseInt(key) + 1].add(`Lỗi: ${error}`);
          });
        } else {
          errorMessagesMap[parseInt(key) + 1].add(`Lỗi: ${String(errors)}`);
        }

        return `Hàng ${parseInt(key) + 1}: ${Array.from(errorMessagesMap[parseInt(key) + 1]).join(', ')}`;
      })
      .join("\n");
  } else {
    return String(warning) || "An error occurred";
  }
};

