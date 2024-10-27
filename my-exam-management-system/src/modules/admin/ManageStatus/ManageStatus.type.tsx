export interface roomStatus {
    id: string
    room: string
    subject: string
    totalStudent: number
    studentAttendingExam: number
    studentForbidded: number
}

export interface studentStatus {
    id: string;
    image: string;
    studentName: string;
    timeStart: string;
    studentStatus: number;
}