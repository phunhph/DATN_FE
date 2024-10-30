export interface BaseResponse {
    status: number|string;
    success: boolean;
    warning?: string;
    message?: string;
  }
  