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
  retry = 5
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
        warning: error.response?.data?.message || "Đã xảy ra lỗi"
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



export const loginClient = async (
  username: string,
  password: string,
  retry = 5
): Promise<LoginResponse> => {
  try {
    // Gửi yêu cầu đến API
    const response: AxiosResponse<LoginResponse> = await instance.post('api/client/login', {
      username,
      password,
    });
    return response.data;

  } catch (error) {
    console.log("Lỗi xảy ra:", error);

    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED' && retry > 0) {
        console.warn("Timeout occurred, retrying...");
        return loginClient(username, password, retry - 1);
      }
      return {
        success: false,
        token: '',
        data: [],
        expires_at: 0,
        status: error.response?.status || "500",
        warning: error.response?.data?.message || "Đã xảy ra lỗi từ server.",
      };
    }

    // Xử lý lỗi khác (không phải từ Axios)
    console.error("Login error:", (error as Error).message || error);
    return {
      success: false,
      token: '',
      data: [],
      expires_at: 0,
      status: "500",
      warning: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
    };
  }
};
