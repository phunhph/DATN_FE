import { ApiExamResponse, Exam } from "@interfaces/index";
import { instance } from "@/services/api/api";
import { AxiosResponse, AxiosError } from "axios";

export const getAllExam = async (): Promise<ApiExamResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<Exam[]> = await instance.get(
      "/api/admin/exams-management",
      {
        headers: headers,
      }
    );

    return {
      success: true,
      message: "Exams fetched successfully",
      data: response.data,
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = `${data.message || "Error occurred"}`;

      return {
        success: false,
        message: errorMessage,
      };
    } else {
      const generalError = "An unknown error occurred while fetching exams.";

      return {
        success: false,
        message: generalError,
      };
    }
  }
};

export const addExam = async (data:Exam ) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiExamResponse> = await instance.post(
      `/api/admin/exams-management`,
      data,
      {
        headers: headers,
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = `${data.message || "Error occurred"}`;

      return {
        success: false,
        message: errorMessage,
      };
    } else {
      const generalError = "An unknown error occurred while fetching exams.";

      return {
        success: false,
        message: generalError,
      };
    }
  }
};

export const updateExam = async (data:Exam ) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiExamResponse> = await instance.put(
      `/api/admin/exams-management/${data.id}`,
      data,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = `${data.message || "Error occurred"}`;

      return {
        success: false,
        message: errorMessage,
      };
    } else {
      const generalError = "An unknown error occurred while fetching exams.";

      return {
        success: false,
        message: generalError,
      };
    }
  }
};

export const removeExam = async (id:string) => { 
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiExamResponse> = await instance.delete(
      `/api/admin/exams-management/${id}`,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = `${data.message || "Error occurred"}`;

      return {
        success: false,
        message: errorMessage,
      };
    } else {
      const generalError = "An unknown error occurred while fetching exams.";

      return {
        success: false,
        message: generalError,
      };
    }
  }
};

