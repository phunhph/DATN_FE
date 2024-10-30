import { instance } from "@/services/api/api";
import { AxiosError, AxiosResponse } from 'axios';

interface LoginResponse {
  success: boolean;
  token: string;
  data: [];
  expires_at: number;
  status: string | number;
  warning: string;
}

export const login = async (
  username: string,
  password: string,
  retry = 1
): Promise<LoginResponse> => {
  try {
    const response: AxiosResponse<LoginResponse> = await instance.post('api/admin/login', { username, password });
    return response.data;
  } catch (error) {
    console.log(error);

    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED' && retry > 0) {
        console.log("Timeout occurred, retrying...");
        return login(username, password, retry - 1); 
      }

      return {
        success: false,
        token: '',
        data: [],
        expires_at: 0,
        status: error.response?.status || "500",
        warning: error.response?.data?.warning || "Đã xảy ra lỗi"
      };
    } else {
      console.error("Login error:", (error as Error).message || error);
      return {
        success: false,
        token: '',
        data: [],
        expires_at: 0,
        status: "500",
        warning: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau."
      };
    }
  }
};
