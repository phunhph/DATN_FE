import { Button, PageTitle, Table } from "@components/index"
import "./ManageExamSessions.scss"
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SessionType } from "./ManageExamSessions.type";
import AsyncSelect from "react-select/async";


const ManageExamSessions = () => {
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [animateOut, setAnimateOut] = useState<boolean>(false);

    //mock data
    const sessionList = [
        { id: 1, sessionCode: "CT2024-01", sessionName: "Ca thi buổi sáng - Toán học", status: "Đang diễn ra" },
        { id: 2, sessionCode: "CT2024-02", sessionName: "Ca thi buổi chiều - Vật lý", status: "Chưa bắt đầu" },
        { id: 3, sessionCode: "CT2024-03", sessionName: "Ca thi buổi tối - Hóa học", status: "Đã kết thúc" },
        { id: 4, sessionCode: "CT2024-04", sessionName: "Ca thi buổi sáng - Lịch sử", status: "Chưa bắt đầu" },
        { id: 5, sessionCode: "CT2024-05", sessionName: "Ca thi buổi chiều - Sinh học", status: "Đang diễn ra" },
        { id: 6, sessionCode: "CT2024-06", sessionName: "Ca thi buổi tối - Địa lý", status: "Đã kết thúc" }
    ];
    const statusOptions = [
        { value: 0, label: "Chưa bắt đầu" },
        { value: 1, label: "Đang diễn ra" },
        { value: 2, label: "Đã kết thúc" },
      ];
    const emptyFormValue: SessionType = {
        sessionName: "",
        status: 0,
        sessionStart: "",
        sessionEnd: "",
    };
    const handleStatusChange = (id: string) => {
        alert("Status id " + id);
    }

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm<SessionType>();

    const onSubmit: SubmitHandler<SessionType> = ( data: SessionType ) => {
        console.log(data)
    }

    const openAddExamSessionForm = () => {
        setOpenForm(true)
        
    }
    const closeAddExamSessionForm = () => {
        setAnimateOut(true);
        reset(emptyFormValue)
        setTimeout(() => {
            setAnimateOut(false);
            setOpenForm(false);
        }, 300);
      };
    return (
        <>
            <div className="examSessions__container">
                <PageTitle theme="light">Quản lý ca thi</PageTitle>
                <Table
                    data={sessionList}
                    tableName="Ca thi"
                    actions_add={{ name: "Thêm ca thi", onClick: openAddExamSessionForm }}
                    actions_edit={{ name: "Sửa", onClick: openAddExamSessionForm}}
                    actions_detail={{ name: "Chi tiết", onClick: () => { alert("a") } }}
                    action_dowload={{ name: "Tải xuống", onClick: () => { alert("a") } }}
                    action_status={handleStatusChange}
                />
                <div className={`semester ${openForm ? '' : "hidden"}`}>
                    {openForm && (
                    <div className={`semester__overlay ${ animateOut ? "fade-out" : "fade-in"}`}>
                        <div className="semester__overlay-content">
                        <Button type="button" className="btn btn-close" onClick={closeAddExamSessionForm}>X</Button>
                        <form className="form" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form__group">
                            <label htmlFor="sessionName" className="form__label">Tên kỳ thi:</label>
                            <input id="sessionName" type="text" className="form__input"
                                {...register("sessionName", {required: "Tên ca thi là bắt buộc"})}
                            />
                            <div className="form__error">
                                {errors.sessionName && (<span>{errors.sessionName.message}</span>)}
                            </div>
                            </div>

                            <div className="form__group">
                            <label htmlFor="status" className="form__label">Trạng thái ca thi:</label>
                            <Controller
                                name="status"
                                control={control}
                                rules={{required: "Trạng thái là bắt buộc"}}
                                render={( { field }) => (
                                    <AsyncSelect
                                    cacheOptions
                                    defaultOptions={statusOptions}
                                    placeholder="Chọn trạng thái"
                                    onChange={(selectedOption) => setValue("status", selectedOption?.value || 0)}/>
                                )}
                            />
                            <div className="form__error">
                                {errors.status && (<span>{errors.status.message}</span>)}
                            </div>
                            </div>
                            <div className="form__group">
                            <label htmlFor="sessionStart" className="form__label">Thời gian bắt đầu:</label>
                            <input id="sessionStart" type="date" className="form__input"
                                {...register("sessionStart", {required: "Thời gian bắt đầu là bắt buộc"})}
                            />
                            <div className="form__error">
                                {errors.sessionStart && (<span>{errors.sessionStart.message}</span>)}
                            </div>
                            </div>
                            <div className="form__group">
                            <label htmlFor="sessionEnd" className="form__label">Thời gian kết thúc:</label>
                            <input id="sessionEnd" type="date" className="form__input"
                                {...register("sessionEnd", {required: "Thời gian kết thúc là bắt buộc"})}
                            />
                            <div className="form__error">
                                {errors.sessionEnd && (<span>{errors.sessionEnd.message}</span>)}
                            </div>
                            </div>
                            <div className="btn-group">
                            <Button type="reset" className="btn btn-reset" onClick={()=>reset({sessionName: "", status: 0, sessionEnd:'',sessionStart: ''})}>Đặt lại</Button>
                            <Button type="submit" className="btn btn-submit">Tạo mới</Button>
                            </div>
                        </form>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ManageExamSessions