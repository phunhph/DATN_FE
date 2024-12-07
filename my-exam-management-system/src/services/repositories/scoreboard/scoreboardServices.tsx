import {  ApiScoreBoardResponse } from "@/interfaces/SemesterInterface/SemestertInterface";
import { instance } from "@/services/api/api";
import { AxiosResponse, AxiosError } from "axios";

export const getScoreboard = async (id: string): Promise<ApiScoreBoardResponse> => {
  try {
      const token = localStorage.getItem("token");

      const headers = {
          Authorization: `Bearer ${token}`,
      };

      const response: AxiosResponse<ApiScoreBoardResponse> = await instance.get(
          `api/client/scoreboard/${id}`,
          { headers }
      );

      return response.data; // Return the API response data
  } catch (error) {
      if (error instanceof AxiosError && error.response) {
          const { data } = error.response;
          const errorMessage = data?.message || "Error occurred";

          return {
              success: false,
              message: errorMessage,
              data: [],
              status: 500,
          } as ApiScoreBoardResponse;
      }

      return {
          success: false,
          message: "An unknown error occurred while fetching exams.",
          data: [],
          status: 500,
      } as ApiScoreBoardResponse;
  }
};
