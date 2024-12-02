/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiSessionResponse, SessionCreate } from "@/interfaces/SessionInterface/SessionInterface";
import { instance } from "@/services/api/api";
import axios, { AxiosError, AxiosResponse } from "axios";

export const getAllSession = async (): Promise<ApiSessionResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiSessionResponse> = await instance.get(
      "/api/admin/exam-session",
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
        data: [],
        status: 500,
      };
    } else {
      const generalError = "An unknown error occurred while fetching sessions.";

      return {
        success: false,
        message: generalError,
        data: [],
        status: 500,
      };
    }
  }
};

export const addSession = async (data: SessionCreate) => {
  const formattedData = {
    id:data.id,
    name: data.name, 
    time_start: data.time_start, 
    time_end: data.time_end,
    status: data.status,
  };

  console.log("Data being sent:", formattedData);
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiSessionResponse> = await instance.post(
      `/api/admin/exam-session`,
      formattedData, 
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
      const errorMessage = `${data.message || "Error occurred"}`;

      return {
        success: false,
        message: errorMessage,
      };
    } else {
      const generalError = "An unknown error occurred while adding session.";

      return {
        success: false,
        message: generalError,
      };
    }
  }
};

export const updateSession = async (data: SessionCreate) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiSessionResponse> = await instance.put(
      `/api/admin/exam-session/${data.id}`,
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
      const generalError = "An unknown error occurred while fetching sessions.";

      return {
        success: false,
        message: generalError,
      };
    }
  }
};

export const getSessionsBySubjectId = async (subjectId: string) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiSessionResponse> = await axios.get(
      `/api/admin/exam-session/subject/${subjectId}`,
      { headers: headers }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const errorMessage = error.response.data.message || "Error occurred";
      return {
        success: false,
        message: errorMessage,
      };
    } else {
      return {
        success: false,
        message: "An unknown error occurred while fetching sessions.",
      };
    }
  }
};