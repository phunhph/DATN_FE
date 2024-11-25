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

export const getExamByIdCode = async (id: string, code: string):Promise<ApiCandidateResponse__ > => {
  try {
    const token = localStorage.getItem("token");
   
    const data = {
      "id_subject": id,
      "idCode": code
  }

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
    console.log(response);
    
    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      console.log(data);
      const errorMessage = formatWarningMessage(data.warning);
      return {
        success: false,
        message: errorMessage,
       status:500,
      };
    } else {
      const generalError =
        "An unknown error occurred while adding exam subject.";

      return {
        success: false,
        message: generalError,
        status:500,
      };
    }
  }
}

export const CandidateById = async (
  id: string
): Promise<ApiCandidateInFoResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiCandidateInFoResponse> = await instance.get(
      `/api/client/info/${id}`,
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