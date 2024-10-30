import { ApiSemesterResponse, Semester } from "@/interfaces/SemesterInterface/SemestertInterface";
import { instance } from "@/services/api/api";
import { AxiosResponse, AxiosError } from "axios";

export const getAllSemester = async (): Promise<ApiSemesterResponse> => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<Semester[]> = await instance.get(
      "/api/admin/exams-management",
      {
        headers: headers,
      }
    );

    return {
      success: true,
      message: "Exams fetched successfully",
      data: response.data,
      status: 200
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      const { data } = error.response;
      const errorMessage = `${data.message || "Error occurred"}`;

      return {
        success: false,
        message: errorMessage,
        data: [],
        status: 500
      };
    } else {
      const generalError = "An unknown error occurred while fetching exams.";

      return {
        success: false,
        message: generalError,
        data: [],
        status: 500
      };
    }
  }
};

export const addSemester = async (data: Semester) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiSemesterResponse> = await instance.post(
      `/api/admin/exams-management`,
      data,
      {
        headers: headers,
      }
    );

    return {
      success: response.data.success,
      message: response.data.message || response.data.warning,
      data: response.data.data,
      status: 201
    };;
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

export const updateSemester = async (data: Semester) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiSemesterResponse> = await instance.put(
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

export const removeSemester = async (id: string) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiSemesterResponse> = await instance.delete(
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

