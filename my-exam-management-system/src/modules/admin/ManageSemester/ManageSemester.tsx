import { PageTitle, GridItem, Button, Notification } from "@components/index";
import "./ManageSemester.scss";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SemesterFormMode, SemesterType } from "./Semester.type";
import {useAdminAuth} from '@hooks/AutherHooks';
import { addSemester, getAllSemester, removeSemester, updateSemester } from "@/services/repositories/SemesterServices/SemesterServices";
import { Semester } from "@/interfaces/SemesterInterface/SemestertInterface";
import applyTheme from "@/SCSS/applyTheme";

const ManageSemester = () => {
  useAdminAuth();
  applyTheme()

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [animateOut, setAnimateOut] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<SemesterFormMode>("add");
  const [semesterData, setSemesterData] = useState<SemesterType[]>([])
  const [notifications, setNotifications] = useState<
    Array<{ message: string; isSuccess: boolean }>
  >([]);
  const addNotification = (message: string, isSuccess: boolean) => {
    setNotifications((prev) => [...prev, { message, isSuccess }]);
  };
  const clearNotifications = () => {
    setNotifications([]);
  };
  const openSemesterForm = (mode: SemesterFormMode, info: SemesterType | null = null) => {
    setFormMode(mode);
    // check form mode, check info availability, reset when done
    if (mode === "update") {
      if (info !== null) {
        // console.log("form is update and info is set:", info);
        reset(info);
      } else {
        // console.log("form is update but info is NOT set");
      }
    } else {
      // console.log("form is add and info is empty");
      reset(emptyFormValue);
    }
    setOpenForm(true);
    setAnimateOut(false);
  };
  const closeSemesterForm = () => {
    setFormMode("add");
    setAnimateOut(true);
    setTimeout(() => {
      setAnimateOut(false);
      setOpenForm(false);
    }, 300);
  };
  const emptyFormValue: SemesterType = {
    semesterName: "",
    semesterCode: "",
    semesterStart: "",
    semesterEnd: "",
    semesterStatus: true,
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SemesterType>({
    defaultValues: emptyFormValue,
  });
  const onSubmit: SubmitHandler<SemesterType> = (
    data: SemesterType
  ) => {
    const data_ = formatDadtaCreateUpdate(data);
    if (formMode === "add") {
      console.log("using add API:", data);
      handlerCreateSemester(data_);
    } else {
      console.log("using update API:", data);
      handlerUpdateSemester(data_);
    }
    reset(emptyFormValue);
    closeSemesterForm();
  }
  const formatDadtaCreateUpdate = (data: SemesterType) =>{ 
    const data_: Semester = {
      id: data.semesterCode,
      name: data.semesterName,
      time_start: data.semesterStart,
      time_end: data.semesterEnd,
      status: data.semesterStatus,
    }
    return data_;
  }
  const handlerCreateSemester = async (data: Semester) => {
    try {
      const result = await addSemester(data);

      if (result.success) {
        const dataUpdate = result.data ? formatData(result.data) : [];
        setSemesterData((prevSubjects) => [...prevSubjects, dataUpdate[0]]);
      }

      addNotification(result.message ?? "Thêm mới kỳ thi thành công", result.success);
    } catch (error) {
      addNotification("An error occurred while creating the Semester.", false);
      console.error(error);
    }
  };

  const handlerUpdateSemester = async (data: Semester) => {
    const result = await updateSemester(data);
    if (result.success) {
      // const dataUpdate = formatData(result.data);
      // setSemesterData((prevSubjects) => {
      //   const existingSubjectIndex = prevSubjects.findIndex(
      //     (content) => content.semesterCode === dataUpdate[0].semesterCode
      //   );

      //   if (existingSubjectIndex !== -1) {
      //     const updatedSubjects = [...prevSubjects];
      //     const existingSubject = updatedSubjects[existingSubjectIndex];

      //     updatedSubjects[existingSubjectIndex] = {
      //       ...existingSubject,
      //       ...dataUpdate[0],
      //     };

      //     return updatedSubjects;
      //   } else {
      //     return [...prevSubjects, dataUpdate[0]];
      //   }
      // });
    }
    addNotification(result.message ?? "Cập nhập kỳ thi thành công", result.success);
  };
  const handleDeleteConfirmation = (semesterCode: string, semesterName: string) => {
    if (window.confirm(`Are you sure you want to delete this semester ${semesterName}?`)) {
      onDelete(semesterCode);
    }
  };  
  const onDelete = async (semesterCode: string) => {
    try {
      const result = await removeSemester(semesterCode); 
      console.log(result);
  
      if (result.success) {
        setSemesterData(prevData => prevData.filter(item => item.semesterCode !== semesterCode)); 
      }
      addNotification(result.message ?? "Xóa kỳ thi thành công", result.success);
    } catch (error) {
      addNotification("Đã xảy ra lỗi khi xóa kỳ thi.", false);
      console.error("Delete error:", error);
    }
  };
  
  const formatData = (data: Semester[] | Semester) => {
    if (Array.isArray(data)) {
      return data.map((e) => ({
        semesterName: e.name,
        semesterCode: e.id,
        semesterStart: e.time_start,
        semesterEnd: e.time_end,
        semesterStatus: e.status,
      }));
    } else if (data && typeof data === "object") {
      return [
        {
          semesterName: data.name,
          semesterCode: data.id,
          semesterStart: data.time_end,
          semesterEnd: data.time_start,
          semesterStatus: data.status,
        },
      ];
    }

    return [];
  };
  const getSemester = async () => {
    const data = await getAllSemester();
    if (data.success) {
      const listSemester = formatData(data.data)
      setSemesterData(listSemester)
    } else {
      addNotification(data.message ?? 'Đã có lỗi xảy ra', data.success);
    }
  };
  const onLoad = () => {
    getSemester()
  }

  useEffect(() => {
    onLoad()
  }, [])

  return (
    <div className="semester__container">
      <PageTitle theme="light">Quản lý kỳ thi</PageTitle>
      <div className="semester-grid__container">
        <GridItem>
          <div className="grid__add-button" onClick={() => openSemesterForm("add")}>
            <img className="non-selectable" src="/plus-circle.svg" alt="icon"></img>
          </div>
        </GridItem>
        {semesterData.map((semester, index) => (
          <GridItem key={index} className="cursor-default">
            <h2 className="semester__name">{semester.semesterName}</h2>
            <p className="semester__info">Mã kỳ thi: {semester.semesterCode}</p>
            <p className="semester__info">Thời gian bắt đầu: {semester.semesterStart}</p>
            <p className="semester__info">Thời gian kết thúc: {semester.semesterEnd}</p>
            <div className="btn-group-2">
              <Button type="button" onClick={() => handleDeleteConfirmation(semester.semesterCode, semester.semesterName)} className="btn btn-del">Xóa</Button>
              <Button type="button" onClick={() => openSemesterForm("update", semester)} className="btn btn-update">Cập nhật</Button>
            </div>
          </GridItem>
        ))}
      </div>
      <div className={`semester ${openForm ? '' : "hidden"}`}>
        {openForm && (
          <div className={`semester__overlay ${animateOut ? "fade-out" : "fade-in"}`}>
            <div className="semester__overlay-content">
              <Button type="button" className="btn btn-close" onClick={closeSemesterForm}>X</Button>
              <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form__group">
                  <label htmlFor="semesterCode" className="form__label">Mã kỳ thi:</label>
                  <input
                    id="semesterCode"
                    type="text"
                    className="form__input"
                    readOnly={formMode === 'update'}
                    {...register("semesterCode", { required: "Mã kỳ thi là bắt buộc" })}
                  />

                  <div className="form__error">
                    {errors.semesterCode && (<span>{errors.semesterCode.message}</span>)}
                  </div>
                </div>
                <div className="form__group">
                  <label htmlFor="semesterName" className="form__label">Tên Kỳ thi:</label>
                  <input id="semesterName" type="text" className="form__input"
                    {...register("semesterName", { required: "Tên kỳ thi là bắt buộc" })}
                  />
                  <div className="form__error">
                    {errors.semesterName && (<span>{errors.semesterName.message}</span>)}
                  </div>
                </div>
                <div className="form__group">
                  <label htmlFor="semesterStart" className="form__label">Thời gian bắt đầu:</label>
                  <input id="semesterStart" type="date" className="form__input"
                    {...register("semesterStart", { required: "Thời gian bắt đầu là bắt buộc" })}
                  />
                  <div className="form__error">
                    {errors.semesterStart && (<span>{errors.semesterStart.message}</span>)}
                  </div>
                </div>
                <div className="form__group">
                  <label htmlFor="semesterEnd" className="form__label">Thời gian kết thúc:</label>
                  <input id="semesterEnd" type="date" className="form__input"
                    {...register("semesterEnd", { required: "Thời gian kết thúc là bắt buộc" })}
                  />
                  <div className="form__error">
                    {errors.semesterEnd && (<span>{errors.semesterEnd.message}</span>)}
                  </div>
                </div>
                <div className="btn-group">
                  <div className="btn-group">
                    {formMode === 'add' ? (
                      <>
                        <Button type="reset" className="btn btn-reset">Đặt lại</Button>
                        <Button type="submit" className="btn btn-submit">Tạo mới</Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={closeSemesterForm} className="btn btn-reset">Hủy</Button>
                        <Button type="submit" className="btn btn-submit">Cập nhật</Button>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Notification
        notifications={notifications}
        clearNotifications={clearNotifications}
      />
    </div>
  );
};

export default ManageSemester;
