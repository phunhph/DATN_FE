import { Button, GridItem, PageTitle } from '@/components'
import './ManageStatus.scss'
import { useEffect, useState, useRef, useCallback } from 'react'
import { roomStatus, studentStatus } from './ManageStatus.type'
import Echo from "laravel-echo"
import { applyTheme } from '@/SCSS/applyTheme'
import { useAdminAuth } from '@/hooks'

const API_BASE_URL = 'http://datn_be.com/api'
const PUSHER_KEY = 'be4763917dd3628ba0fe'
const PUSHER_CLUSTER = 'ap1'

type EchoChannels = {
    [channel: string]: {
      "student.submitted": { id: string; }; // Example event and payload type
      joining: { id: string; };            // Example for "joining" event
      leaving: { id: string; };            // Example for "leaving" event
    };
  };

const ManageStatus = () => {
    useAdminAuth();
    applyTheme()

    const [roomStatusList, setRoomStatusList] = useState<roomStatus[]>([])
    const [studentStatusList, setStudentStatusList] = useState<studentStatus[]>([])
    const [openStudentStatus, setOpenStudentStatus] = useState(false)
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null)
    const [studentStatusCounts, setStudentStatusCounts] = useState({
        total: 0,
        // notStarted: 0,
        inProgress: 0,
        completed: 0,
        // forbidden: 0
    })
    const submittedStudents = useRef<Record<string, boolean>>({})
    const echoInstance = useRef<Echo<'pusher'> | null>(null)
    const subjectRef = useRef<any>(null)

    const getAuthToken = useCallback(() => {
        const tokenData = localStorage.getItem('token')
        return tokenData ? JSON.parse(tokenData).token : null
    }, [])

    const calculateStudentStatusCounts = useCallback((students: studentStatus[]) => {
        const counts = students.reduce((acc, student) => {
            acc.total++;

            if (student.studentStatus == 2) {
                acc.completed++;
            }

            if (student.studentStatus == 1) {
                acc.inProgress++;
            }

            return acc;
        }, {
            total: 0,
            // notStarted: 0,
            inProgress: 0,
            completed: 0,
        });

        // counts.inProgress = counts.total - counts.completed;

        setStudentStatusCounts(counts);
    }, []);

    const updateStudentListStatus = useCallback((studentId: string, newStatus: number) => {
        setStudentStatusList(prevList => {
            const updatedList = prevList.map(student =>
                student.id === studentId ? { ...student, studentStatus: newStatus } : student
            )
            calculateStudentStatusCounts(updatedList)
            return updatedList
        })
    }, [calculateStudentStatusCounts])

    const initializeEcho = useCallback(() => {
        if (!echoInstance.current) {
            try {
                echoInstance.current = new Echo({
                    broadcaster: 'pusher',
                    key: PUSHER_KEY,
                    cluster: PUSHER_CLUSTER,
                    forceTLS: true,
                    authEndpoint: `${API_BASE_URL}/custom-broadcasting/auth-admin`,
                    auth: {
                        headers: {
                            'Authorization': `Bearer ${getAuthToken()}`,
                        }
                    },
                    withCredentials: true,
                })
            } catch (error) {
                console.error('Echo initialization error:', error)
            }
        }
        return echoInstance.current
    }, [getAuthToken])

    const setupWebSocketListeners = useCallback((echo: Echo<'pusher'>, roomID: string, subjectId: string) => {
        const channel = echo.join(`presence-room.${roomID}.${subjectId}`)

        channel.here((users: any) => {
            setStudentStatusList(prevList => {
                const updatedList = prevList.map(student => {
                    const isCurrentlyTakingExam = users.some((user:any) => user.id === student.id)
                    return isCurrentlyTakingExam ? { ...student, studentStatus: 1 } : student
                })
                calculateStudentStatusCounts(updatedList)
                return updatedList
            })
        })

        channel.joining((user: any) => {
            updateStudentListStatus(user.id, 1)
        })

        channel.leaving((user: any) => {
            if (!submittedStudents.current[user.id]) {
                updateStudentListStatus(user.id, 0)
            }
        })

        channel.listen('.student.submitted', (data: any) => {
            submittedStudents.current[data.id] = true
            updateStudentListStatus(data.id, 2)
        })
    }, [calculateStudentStatusCounts, updateStudentListStatus])

    const getListOfStudentStatus = useCallback(async (roomID: string, subjectId: string) => {
        subjectRef.current = subjectId;

        try {
            const response = await fetch(`${API_BASE_URL}/room-status/rooms/${roomID}/${subjectId}/students`)
            const studentStatuses = await response.json()
            setStudentStatusList(studentStatuses)
            calculateStudentStatusCounts(studentStatuses)

            const echo = initializeEcho()
            if (echo) {
                setupWebSocketListeners(echo, roomID, subjectId)
                setCurrentRoomId(roomID)
                setOpenStudentStatus(true)
            }
        } catch (error) {
            console.error('Error fetching student statuses:', error)
        }
    }, [calculateStudentStatusCounts, initializeEcho, setupWebSocketListeners])

    const returnToRoomList = useCallback(() => {
        if (currentRoomId && echoInstance.current) {
            echoInstance.current.leave(`presence-room.${currentRoomId}.${subjectRef.current}`)
        }
        setOpenStudentStatus(false)
        setStudentStatusList([])
        setCurrentRoomId(null)
        subjectRef.current = null
    }, [currentRoomId])

    useEffect(() => {
        const fetchRoomStatuses = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("token") || "{}").token;

                if (!token) {
                    console.error("Token is missing");
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/room-status/rooms`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const roomStatuses = await response.json()
                setRoomStatusList(roomStatuses)
            } catch (error) {
                console.error('Error fetching room statuses:', error)
            }
        }
        fetchRoomStatuses()
    }, [])

    useEffect(() => {
        return () => {
            if (echoInstance.current) {
                echoInstance.current.disconnect()
            }

            if (subjectRef.current) {
                subjectRef.current = null
            }
        }
    }, [])

    const renderStatusText = (status: number) => {
        const statusMap = {
            0: <span className='status-red'>Mất kết nối</span>,
            1: <span className='status-yellow'>Đang thi</span>,
            2: <span className='status-green'>Đã hoàn thành</span>,
            // 3: <span className='status-red'>Cấm thi</span>,
            // 4: <span className='status-red'>Mất kết nối</span>
        }
        return statusMap[status as keyof typeof statusMap]
    }

    return (
        <div className='admin-status__container'>
            {!openStudentStatus && roomStatusList.length > 0 && (
                <>
                    <PageTitle theme='light'>Trạng thái phòng thi</PageTitle>
                    <div className='admin-status__group'>
                        {roomStatusList.map(room => (
                            <GridItem key={room.id} className='admin-status__item cursor-default'>
                                <div>
                                    <h2>Phòng thi: {room.room}</h2>
                                </div>
                                <div>
                                    <p>Môn thi: {room.subject}</p>
                                    <p>Tổng thí sinh: {room.totalStudent}</p>
                                </div>
                                <div>
                                    <Button
                                        className='admin-status__detail-btn'
                                        onClick={() => getListOfStudentStatus(room.roomId, room.subjectId)}
                                    >
                                        Chi tiết
                                    </Button>
                                </div>
                            </GridItem>
                        ))}
                    </div>
                </>
            )}

            {openStudentStatus && studentStatusList.length > 0 && (
                <>
                    <PageTitle theme='light'>Trạng thái thí sinh</PageTitle>
                    <div className="student-status-summary">
                        <p>Tổng số: {studentStatusCounts.total}</p>
                        {/* <p>Chưa thi: {studentStatusCounts.notStarted}</p> */}
                        <p>Đang thi: {studentStatusCounts.inProgress}</p>
                        <p>Đã hoàn thành: {studentStatusCounts.completed}</p>
                        {/* <p>Cấm thi: {studentStatusCounts.forbidden}</p> */}
                    </div>
                    <button className="btn-return" onClick={returnToRoomList}>
                        <img src="/Back.svg" alt="Back" />
                    </button>
                    <div className='admin-status__group'>
                        {studentStatusList.map(student => (
                            <GridItem key={student.id} className='admin-status__item cursor-default'>
                                <div>
                                    <img
                                        className='admin-status__student-image'
                                        src={student.image}
                                        alt={student.studentName}
                                    />
                                </div>
                                <div>
                                    <h2>{student.studentName}</h2>
                                </div>
                                <div>
                                    <p>Thời gian bắt đầu: {student.timeStart || "Không khả dụng"}</p>
                                    <p>Trạng thái: {renderStatusText(student.studentStatus)}</p>
                                </div>
                            </GridItem>
                        ))}
                    </div>
                </>
            )}

            {!openStudentStatus && roomStatusList.length === 0 && (
                <>
                    <PageTitle theme='light'>Trạng thái phòng thi</PageTitle>
                    <p className='no-data'>Không có dữ liệu</p>
                </>
            )}

            {openStudentStatus && studentStatusList.length === 0 && (
                <>
                    <PageTitle theme='light'>Trạng thái thí sinh</PageTitle>
                    <button className="btn-return" onClick={returnToRoomList}>
                        <img src="/Back.svg" alt="Back" />
                    </button>
                    <p className='no-data'>Không có dữ liệu</p>
                </>
            )}
        </div>
    )
}

export default ManageStatus