import { instance } from "@/services/api/api";
import { AxiosError, AxiosResponse  } from 'axios';
interface LoginResponse {
  success: boolean;
  token:string;
  data:[];
  expires_at:number;
  status: string | number;
  warning: string; 
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await instance.post('api/admin/login', { username, password });
      return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
          return {
            success: false,
            token: '',
            data: [],
            expires_at:0,
            status: error.response?.status || "500",
            warning: error.response?.data?.warning || "Đã xảy ra lỗi"
          };
        } else {
          console.error("Login error:", (error as Error).message || error);
    
          return {
            success: false,
            token: '',
            data: [],
            expires_at:0,
            status: "500",
            warning: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau."
          };
        }
      }
  };
  