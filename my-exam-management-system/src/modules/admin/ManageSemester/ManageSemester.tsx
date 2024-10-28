import { PageTitle, GridItem, Button } from "@components/index";
import "./ManageSemester.scss";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SemesterFormMode, SemesterType } from "./Semester.type";
// import useAuth from '@hooks/AutherHooks';

const ManageSemester = () => {
  // useAuth();
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [animateOut, setAnimateOut] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<SemesterFormMode>("add");
  const [semesterData, setSemesterData] = useState<SemesterType[]>([])

  const openSemesterForm = ( mode: SemesterFormMode, info: SemesterType | null = null) => {
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
  };
  const semesterDemoData: SemesterType[] = [
    {
      semesterName: "Fall 2024",
      semesterCode: "F2024",
      semesterStart: "2024-09-01",
      semesterEnd: "2024-12-15",
    },
    {
      semesterName: "Spring 2024",
      semesterCode: "S2024",
      semesterStart: "2024-01-10",
      semesterEnd: "2024-05-15",
    },
    {
      semesterName: "Summer 2024",
      semesterCode: "SU2024",
      semesterStart: "2024-06-01",
      semesterEnd: "2024-08-31",
    },
    {
      semesterName: "Winter 2024",
      semesterCode: "W2024",
      semesterStart: "2024-12-16",
      semesterEnd: "2024-01-09",
    },
    {
      semesterName: "Fall 2023",
      semesterCode: "F2023",
      semesterStart: "2023-09-01",
      semesterEnd: "2023-12-15",
    },
    {
      semesterName: "Spring 2023",
      semesterCode: "S2023",
      semesterStart: "2023-01-10",
      semesterEnd: "2023-05-15",
    },
    {
      semesterName: "Summer 2023",
      semesterCode: "SU2023",
      semesterStart: "2023-06-01",
      semesterEnd: "2023-08-31",
    },
  ];
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
    if (formMode === "add") {
      console.log("using add API:", data);
    } else {
      console.log("using update API:", data);
    }
    reset(emptyFormValue);
    closeSemesterForm();
  }
  const onDelete = (semesterCode:string) => {
    console.log(semesterCode)
    // API CALL
    onLoad() //reload data
  }
  const onLoad = () => {
    setSemesterData(semesterDemoData)
  }

  useEffect(()=>{
    onLoad()
  },[])

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
                <Button type="button" onClick={() => onDelete(semester.semesterCode)} className="btn btn-del">Xóa</Button>
                <Button type="button" onClick={() => openSemesterForm("update", semester)} className="btn btn-update">Cập nhật</Button>
              </div>
          </GridItem>
        ))}
      </div>
      <div className={`semester ${openForm ? '' : "hidden"}`}>
        {openForm && (
          <div className={`semester__overlay ${ animateOut ? "fade-out" : "fade-in"}`}>
            <div className="semester__overlay-content">
              <Button type="button" className="btn btn-close" onClick={closeSemesterForm}>X</Button>
              <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form__group">
                  <label htmlFor="semesterName" className="form__label">Tên ca thi:</label>
                  <input id="semesterName" type="text" className="form__input"
                    {...register("semesterName", {required: "Tên kỳ thi là bắt buộc"})}
                  />
                  <div className="form__error">
                    {errors.semesterName && (<span>{errors.semesterName.message}</span>)}
                  </div>
                </div>

                <div className="form__group">
                  <label htmlFor="semesterCode" className="form__label">Trạng thái ca thi:</label>
                  <input id="semesterCode" type="text" className="form__input"
                    {...register("semesterCode", {required: "Mã kỳ thi là bắt buộc"})}
                  />
                  <div className="form__error">
                    {errors.semesterCode && (<span>{errors.semesterCode.message}</span>)}
                  </div>
                </div>
                <div className="form__group">
                  <label htmlFor="semesterStart" className="form__label">Thời gian bắt đầu:</label>
                  <input id="semesterStart" type="date" className="form__input"
                    {...register("semesterStart", {required: "Thời gian bắt đầu là bắt buộc"})}
                  />
                  <div className="form__error">
                    {errors.semesterStart && (<span>{errors.semesterStart.message}</span>)}
                  </div>
                </div>
                <div className="form__group">
                  <label htmlFor="semesterEnd" className="form__label">Thời gian kết thúc:</label>
                  <input id="semesterEnd" type="date" className="form__input"
                    {...register("semesterEnd", {required: "Thời gian kết thúc là bắt buộc"})}
                  />
                  <div className="form__error">
                    {errors.semesterEnd && (<span>{errors.semesterEnd.message}</span>)}
                  </div>
                </div>
                <div className="btn-group">
                  <Button type="reset" className="btn btn-reset">Đặt lại</Button>
                  <Button type="submit" className="btn btn-submit">Tạo mới</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSemester;
