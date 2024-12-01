import { ApiSupervisorResponse, CreateSupervisor, Supervisor } from "@/interfaces/SupervisorInterface/SupervisorInterface";
import { instance } from "@/services/api/api";
import { AxiosError, AxiosResponse } from "axios";

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

export const getAllSupervisors = async (): Promise<ApiSupervisorResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<Supervisor[]> = await instance.get(
      "/api/admin/lecturer",
      {
        headers: headers,
      }
    );

    return {
      success: true,
      message: "Supervisors fetched successfully",
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
      const generalError = "An unknown error occurred while fetching supervisors.";

      return {
        success: false,
        message: generalError,
        data: [],
        status: 500,
      };
    }
  }
};

export const addSupervisor = async (data: Supervisor) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    };

    const response: AxiosResponse<ApiSupervisorResponse> = await instance.post(
      `/api/admin/lecturer`,
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

export const DetailSupervisor = async (
  id: string
): Promise<ApiSupervisorResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<Supervisor[]> = await instance.get(
      `/api/admin/lecturer/${id}`,
      {
        headers: headers,
      }
    );

    return {
      success: true,
      message: "Supervisor fetched successfully",
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
      const generalError = "An unknown error occurred while fetching supervisors.";

      return {
        success: false,
        message: generalError,
        data: [],
        status: 500,
      };
    }
  }
};