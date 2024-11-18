import { BaseResponse } from "../InterfaceBaseResponse/InterfaceBaseResponse";

export interface TopicStructure {
    id: number;
    exam_subject_id: string;
    quantity: number;
    time: number;
}
export interface totalStructure {
    title?: string;
    level: string;
    total: number;
    quantity: number;
}

export interface StructureResponse extends BaseResponse {
    data: TopicStructure[];
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

export interface StructureTotalResponse extends BaseResponse {
    data: totalStructure[];
}
