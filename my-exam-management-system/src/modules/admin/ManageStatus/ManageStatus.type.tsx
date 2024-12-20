export interface roomStatus {
    id: string
    room: string
    roomId: string
    subject: string
    subjectId: string
    totalStudent: number
    notStarted: number,
    inProgress: number,
    completed: number,
    forbidden: number
}

export interface studentStatus {
    id: string;
    image: string;
    studentName: string;
    timeStart: string;
    studentStatus: number;
}

export interface statusCounts {
    total: number;
    notStarted: number;
    inProgress: number;
    completed: number;
    forbidden: number;
}