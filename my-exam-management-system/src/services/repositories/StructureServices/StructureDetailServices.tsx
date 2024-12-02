
import { reqStructure, StructureResponse, StructureTotalResponse } from "@/interfaces/ManageStructureInterfaces/ManageStructureInterfaces";
import { ApiExamSubjectResponse } from "@/interfaces/SubjectInterface/ExamSubjectInterface";
import { instance } from "@/services/api/api";
import { AxiosResponse, AxiosError } from "axios";

export const getAllStrutureByIdSubject = async (
  id: string
) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<StructureResponse> = await instance.get(
      `/api/admin/exam-subject-details/exam-subject/${id}`,
      {
        headers: headers,
      }
    );
    return response.data;
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
        "An unknown error occurred while fetching exam subjects.";

      return {
        success: false,
        message: generalError,
        data: [],
      };
    }
  }
};

export const getFinalStructure = async (
  exam:string) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<StructureTotalResponse> = await instance.get(
      `/api/admin/topic-structures/total/${exam}`,
      {
        headers: headers,
      }
    );
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = formatWarningMessage(data.message);

      return {
        success: false,
        message: errorMessage,
        data: [],
        status: 422
      };
    } else {
      const generalError =
        "An unknown error occurred while fetching exam subjects.";

      return {
        success: false,
        message: generalError,
        data: [],
        status: 500
      };
    }
  }
};

export const SubmitStructure = async (data: reqStructure) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiExamSubjectResponse> = await instance.post(
      `/api/admin/topic-structures`,
      data,
      {
        headers: headers,
      }
    );
    console.log(response);
    
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
