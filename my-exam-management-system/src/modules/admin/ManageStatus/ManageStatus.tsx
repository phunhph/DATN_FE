import { Button, GridItem, PageTitle } from '@/components'
import './ManageStatus.scss'
import { useEffect, useState, useRef, useCallback } from 'react'
import { roomStatus, studentStatus } from './ManageStatus.type'
import Echo from "laravel-echo"

const API_BASE_URL = 'http://datn_be.com/api'
const PUSHER_KEY = 'be4763917dd3628ba0fe'
const PUSHER_CLUSTER = 'ap1'

const ManageStatus = () => {
    const [roomStatusList, setRoomStatusList] = useState<roomStatus[]>([])
    const [studentStatusList, setStudentStatusList] = useState<studentStatus[]>([])
    const [openStudentStatus, setOpenStudentStatus] = useState(false)
    const [currentRoomId, setCurrentRoomId] = useState<string | null>(null)
    const [studentStatusCounts, setStudentStatusCounts] = useState({
        total: 0,
        notStarted: 0,
        inProgress: 0, 
        completed: 0,
        forbidden: 0
    })
    const submittedStudents = useRef<Record<string, boolean>>({})
    const echoInstance = useRef<Echo | null>(null)

    const getAuthToken = useCallback(() => {
        const tokenData = localStorage.getItem('token')
        return tokenData ? JSON.parse(tokenData).token : null
    }, [])

    const calculateStudentStatusCounts = useCallback((students: studentStatus[]) => {
        const counts = {
            total: students.length,
            notStarted: students.filter(student => student.studentStatus === 0).length,
            inProgress: students.filter(student => student.studentStatus === 1).length,
            completed: students.filter(student => student.studentStatus === 2).length,
            forbidden: students.filter(student => student.studentStatus === 3).length
        }
        setStudentStatusCounts(counts)
    }, [])

    const updateStudentStatus = useCallback(async (studentId: string, status: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/candidate/${studentId}/update-status/${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify({
                    id: studentId,
                    status,
                    _method: 'PUT'
                })
            })
            if (!response.ok) throw new Error('Failed to update status')
        } catch (error) {
            console.error('Error updating student status:', error)
        }
    }, [getAuthToken])

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

    const setupWebSocketListeners = useCallback((echo: Echo, roomID: string) => {
        const channel = echo.join(`presence-room.${roomID}`)

        channel.here((users) => {
            setStudentStatusList(prevList => {
                const updatedList = prevList.map(student => {
                    const isCurrentlyTakingExam = users.some(user => user.id === student.id)
                    return isCurrentlyTakingExam ? { ...student, studentStatus: 1 } : student
                })
                calculateStudentStatusCounts(updatedList)
                return updatedList
            })
        })

        channel.joining((user) => {
            updateStudentListStatus(user.id, 1)
            updateStudentStatus(user.id, 1)
        })

        channel.leaving((user) => {
            if (!submittedStudents.current[user.id]) {
                updateStudentListStatus(user.id, 4)
                updateStudentStatus(user.id, 4)
            }
        })

        channel.listen('.student.submitted', (data) => {
            submittedStudents.current[data.id] = true
            updateStudentListStatus(data.id, 2)
            updateStudentStatus(data.id, 2)
        })
    }, [calculateStudentStatusCounts, updateStudentStatus, updateStudentListStatus])

    const getListOfStudentStatus = useCallback(async (roomID: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/room-status/rooms/${roomID}/students`)
            const studentStatuses = await response.json()
            setStudentStatusList(studentStatuses)
            calculateStudentStatusCounts(studentStatuses)

            const echo = initializeEcho()
            if (echo) {
                setupWebSocketListeners(echo, roomID)
                setCurrentRoomId(roomID)
                setOpenStudentStatus(true)
            }
        } catch (error) {
            console.error('Error fetching student statuses:', error)
        }
    }, [calculateStudentStatusCounts, initializeEcho, setupWebSocketListeners])

    const returnToRoomList = useCallback(() => {
        if (currentRoomId && echoInstance.current) {
            echoInstance.current.leave(`presence-room.${currentRoomId}`)
        }
        setOpenStudentStatus(false)
        setStudentStatusList([])
        setCurrentRoomId(null)
    }, [currentRoomId])

    useEffect(() => {
        const fetchRoomStatuses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/room-status/rooms`)
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
        }
    }, [])

    const renderStatusText = (status: number) => {
        const statusMap = {
            0: <span className='status-yellow'>Chưa thi</span>,
            1: <span className='status-yellow'>Đang thi</span>,
            2: <span className='status-green'>Đã hoàn thành</span>,
            3: <span className='status-red'>Cấm thi</span>,
            4: <span className='status-red'>Mất kết nối</span>
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
                                        onClick={() => getListOfStudentStatus(room.id)}
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
                        <p>Chưa thi: {studentStatusCounts.notStarted}</p>
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