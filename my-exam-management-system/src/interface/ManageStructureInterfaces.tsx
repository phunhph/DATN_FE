export interface TopicStructure {
    id: number;
    exam_subject_id: string;
    Quantity: number;
    Time: number;
    created_at: string | null;
    updated_at: string | null;
}
export interface totalStructure {
    title?: string;
    Level: string;
    total: number;
    Quantity: number;
}

export interface StructureResponse {
    success: boolean;
    status?: string;
    data: TopicStructure[];
    warning?: string;
    message?: string;
}

export interface ModuleStructure {
    title: string; // Tên module
    levels: totalStructure[]; // Danh sách các mức độ
}
export interface reqStructure {
    time: number | string;
    total: number | string;
    modules: ModuleStructure[];
    checkCreateStruct: boolean;
    subject: number | string;
    exam: string
}

export interface StructureTotalResponse {
    success: boolean;
    status?: string;
    data: totalStructure[];
    warning?: string;
    message?: string;
}
