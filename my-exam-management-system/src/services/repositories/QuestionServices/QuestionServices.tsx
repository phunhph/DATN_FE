import { ApiQuestionResponse, Question } from "@/interfaces/QuestionInterface/QuestionInterface";
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
        status: 500,
        data: [],
      };
    } else {
      const generalError =
        "An unknown error occurred while fetching exam subjects.";

      return {
        success: false,
        message: generalError,
        status: 500,
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
}