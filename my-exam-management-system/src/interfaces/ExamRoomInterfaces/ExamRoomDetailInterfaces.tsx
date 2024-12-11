export interface ExamRoomDetailInterface{
    id: string|number,
    exam_room_id: number|string,
    exam_subject_id: number|string,
    exam_session_id:number|string,
    exam_date:string,
    exam_end:string,
    exam_session: {
        created_at:string | null,
        deleted_at:string | null,
        id: number,
        name:string,
        time_end:string,
        time_start:string,
        updated_at:string
    }
}