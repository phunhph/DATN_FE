import {  ApiScoreBoardResponse } from "@/interfaces/SemesterInterface/SemestertInterface";
import { instance } from "@/services/api/api";
import { AxiosResponse, AxiosError } from "axios";

export const getScoreboard= async (id:string) => {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<ApiScoreBoardResponse> = await instance.get(
      `api/client/scoreboard/${id}`,
      {
        headers: headers,
      }
    );

    return  response;
     
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
