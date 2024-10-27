import { Button, GridItem, PageTitle } from '@/components'
import './ManageStatus.scss'
import { useEffect, useState } from 'react';
import { roomStatus, studentStatus } from './ManageStatus.type';



const ManageStatus = () => {
	const [roomStatusList, setRoomStatusList] = useState<roomStatus[]>([])
	const [studentStatusList, setStudentStatusList] = useState<studentStatus[]>([])
	const [openStudentStatus, setOpenStudentStatus] = useState<boolean>(false)
	console.log(studentStatusList.length)
	const vietnamTime = new Date().toLocaleString("vi-VN", {
		timeZone: "Asia/Ho_Chi_Minh",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	  });
	console.log(vietnamTime)

	const getListOfStudentStatus = (roomID: String) => {
		//api get student
		console.log(roomID)
		const studentMockList: studentStatus[] = [
			{
				id: "st1",
				image:"https://media.printables.com/media/prints/609705/images/4843766_f3a15f19-e7ee-4661-b553-2533084ac8fa_dcb27d2e-db17-433d-8f60-1d129843482d/th-387312948.png",
				studentName:"Phạm Quang Đăng",
				studentStatus: 2,
				timeStart:"20:05:04 27/10/2024"
			},
			{
				id: "st2",
				image:"https://pbs.twimg.com/profile_images/1833615485562474496/1TzLCnyn_400x400.jpg",
				studentName:"Nguyễn Mỹ Anh",
				studentStatus: 0,
				timeStart:"20:05:04 27/10/2024"
			},
			{
				id: "st3",
				image:"https://media.printables.com/media/prints/609705/images/4843766_f3a15f19-e7ee-4661-b553-2533084ac8fa_dcb27d2e-db17-433d-8f60-1d129843482d/th-387312948.png",
				studentName:"Nguyễn Đức Phú",
				studentStatus: 1,
				timeStart:"20:05:04 27/10/2024"
			}
		]

		setStudentStatusList(studentMockList)
		setOpenStudentStatus(true)
	}

	const returnToRoomList = () => {
		setOpenStudentStatus(false)
		setStudentStatusList([])
	}

	useEffect(() => {
		//api get list
		const mockList: roomStatus[] = [
			{
				id: "1",
				room: "Room 101",
				subject: "Mathematics",
				totalStudent: 30,
				studentAttendingExam: 28,
				studentForbidded: 2
			},
			{
				id: "2",
				room: "Room 102",
				subject: "Physics",
				totalStudent: 25,
				studentAttendingExam: 24,
				studentForbidded: 1
			},
			{
				id: "3",
				room: "Room 103",
				subject: "Chemistry",
				totalStudent: 20,
				studentAttendingExam: 19,
				studentForbidded: 1
			},
			{
				id: "4",
				room: "Room 104",
				subject: "English",
				totalStudent: 40,
				studentAttendingExam: 38,
				studentForbidded: 2
			},
			{
				id: "5",
				room: "Room 105",
				subject: "History",
				totalStudent: 15,
				studentAttendingExam: 14,
				studentForbidded: 1
			},
			{
				id: "6",
				room: "Room 106",
				subject: "Geography",
				totalStudent: 18,
				studentAttendingExam: 17,
				studentForbidded: 1
			}
		]
		setRoomStatusList(mockList)
	}, [])
	return (
		<>
			<div className='admin-status__container'>
				{/* Room list */}
				{ !openStudentStatus && roomStatusList.length > 0 && (
					<>
					<PageTitle theme='light'>Trạng thái phòng thi</PageTitle>
					<div className='admin-status__group'>
						{roomStatusList.length > 0 && roomStatusList.map(roomStatus => (
							<GridItem key={roomStatus.id} className='admin-status__item cursor-default'>
								<div>
									<h2>Phòng thi: {roomStatus.room}</h2>
								</div>
								<div>
									<p>Môn thi: {roomStatus.subject}</p>
									<p>Tổng thí sinh: {roomStatus.totalStudent}</p>
									<p>Số thí sinh đang thi: {roomStatus.studentAttendingExam}</p>
									<p>Số thí sinh cấm thi: {roomStatus.studentForbidded}</p>
								</div>
								<div>
									<Button className='admin-status__detail-btn' onClick={() => getListOfStudentStatus("avv")}>Chi tiết</Button>
								</div>
							</GridItem>
						))}
					</div>
					</>
				)}

				{/* Student list */}
				{ openStudentStatus && studentStatusList.length > 0 && (
					<>
					<PageTitle theme='light' >Trạng thái thí sinh</PageTitle>
					<button className="btn-return" onClick={returnToRoomList}><img src="/Back.svg" alt="Back" /></button>
					<div className='admin-status__group'>
						{ studentStatusList.map(studentStatus => (
							<GridItem key={studentStatus.id} className='admin-status__item cursor-default'>
								<div>
									<img className='admin-status__student-image' src={studentStatus.image} alt={studentStatus.studentName}></img>
								</div>
								<div>
									<h2>Phòng thi: {studentStatus.studentName}</h2>
								</div>
								<div>
									<p>Thời gian bắt đầu: {studentStatus.timeStart ? studentStatus.timeStart : "Không khả dụng"}</p>
									{studentStatus.studentStatus == 0 && <p className='status-yellow'>Trạng thái thí sinh: Đang thi</p>}
									{studentStatus.studentStatus == 1 && <p className='status-green'>Trạng thái thí sinh: Đã hoàn thành</p>}
									{studentStatus.studentStatus == 2 && <p className='status-red'>Trạng thái thí sinh: Cấm thi</p>}
								</div>
							</GridItem>
						))}
					</div>
					</>
				)}
				
				{/* No data */}
				{ !openStudentStatus  && roomStatusList.length == 0 && (
					<>
					<PageTitle theme='light' >Trạng thái phòng thi</PageTitle>
					<p className='no-data'>Không có dữ liệu</p>
					</>
				)}
				{ openStudentStatus  && studentStatusList.length == 0 && (
					<>
					<PageTitle theme='light' >Trạng thái thí sinh</PageTitle>
					<button className="btn-return" onClick={returnToRoomList}><img src="/Back.svg" alt="Back" /></button>
					<p className='no-data'>Không có dữ liệu</p>
					</>
				)}
			</div>
		</>
	)
}

export default ManageStatus