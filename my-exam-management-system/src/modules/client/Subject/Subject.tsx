import { useNavigate } from 'react-router-dom';
import './Subject.scss'
import Slideshow from '@components/Slideshow/Slideshow';
import { Button, CVO, GridItem } from '@/components';

const Subject = () => {

    const navigate = useNavigate();
    const navToExamById = (id:string) => {
        console.log(id)
        navigate('/client/exam');
    };
    const images = [
        'https://via.placeholder.com/800x400?text=Banner+1',
        'https://via.placeholder.com/800x400?text=Banner+2',
        'https://via.placeholder.com/800x400?text=Banner+3'
    ];

    return (
        <div className="Subject__Client">
            <div className='Subject__image'>
                <Slideshow/>
            </div>
            {/*  */}
            <div className='Subject__group'>
                <h2>Môn thi</h2>
                <div className='group__contentt'>
                <GridItem className='group__itemm'>
                        <p>Tên kì thi</p>
                        <p>Tên Môn thi: <span className='item__span'>text</span></p>
                        <p>Mã Môn thi:<span className='item__span'>text</span></p>
                        <p>Số câu hỏi:<span className='item__span'>text</span></p>
                        <p>Thời gian bắt đầu:</p>
                        <span className='item__span'> 03/11/2024</span>
                        <p>Thời gian kết thúc:</p>
                        <span className='item__span'> 03/11/2024</span>
                        <p>Số lượng môn thi:<span className='item__span'>text</span></p>
                        <CVO percentage={50}></CVO>
                        <Button onClick={() => navToExamById("idhere")}>Làm bài thi</Button>
                    </GridItem>
                    <GridItem className='group__itemm'>
                        <p>Tên kì thi</p>
                        <p>Tên Môn thi: <span className='item__span'>text</span></p>
                        <p>Mã Môn thi:<span className='item__span'>text</span></p>
                        <p>Số câu hỏi:<span className='item__span'>text</span></p>
                        <p>Thời gian bắt đầu:</p>
                        <span className='item__span'> 03/11/2024</span>
                        <p>Thời gian kết thúc:</p>
                        <span className='item__span'> 03/11/2024</span>
                        <p>Số lượng môn thi:<span className='item__span'>text</span></p>
                        <CVO percentage={50}></CVO>
                        <Button onClick={() => navToExamById("idhere")}>Làm bài thi</Button>
                    </GridItem>
                    <GridItem className='group__itemm'>
                        <p>Tên kì thi</p>
                        <p>Tên Môn thi: <span className='item__span'>text</span></p>
                        <p>Mã Môn thi:<span className='item__span'>text</span></p>
                        <p>Số câu hỏi:<span className='item__span'>text</span></p>
                        <p>Thời gian bắt đầu:</p>
                        <span className='item__span'> 03/11/2024</span>
                        <p>Thời gian kết thúc:</p>
                        <span className='item__span'> 03/11/2024</span>
                        <p>Số lượng môn thi:<span className='item__span'>text</span></p>
                        <CVO percentage={50}></CVO>
                        <Button onClick={() => navToExamById("idhere")}>Làm bài thi</Button>
                    </GridItem>
                    <GridItem className='group__itemm'>
                        <p>Tên kì thi</p>
                        <p>Tên Môn thi: <span className='item__span'>text</span></p>
                        <p>Mã Môn thi:<span className='item__span'>text</span></p>
                        <p>Số câu hỏi:<span className='item__span'>text</span></p>
                        <p>Thời gian bắt đầu:</p>
                        <span className='item__span'> 03/11/2024</span>
                        <p>Thời gian kết thúc:</p>
                        <span className='item__span'> 03/11/2024</span>
                        <p>Số lượng môn thi:<span className='item__span'>text</span></p>
                        <CVO percentage={50}></CVO>
                        <Button onClick={() => navToExamById("idhere")}>Làm bài thi</Button>
                    </GridItem>
                    <GridItem className='group__itemm'>
                        <p>Tên kì thi</p>
                        <p>Tên Môn thi: <span className='item__span'>text</span></p>
                        <p>Mã Môn thi:<span className='item__span'>text</span></p>
                        <p>Số câu hỏi:<span className='item__span'>text</span></p>
                        <p>Thời gian bắt đầu:</p>
                        <span className='item__span'> 03/11/2024</span>
                        <p>Thời gian kết thúc:</p>
                        <span className='item__span'> 03/11/2024</span>
                        <p>Số lượng môn thi:<span className='item__span'>text</span></p>
                        <CVO percentage={50}></CVO>
                        <Button onClick={() => navToExamById("idhere")}>Làm bài thi</Button>
                    </GridItem>

                </div>
            </div>

        </div>
    )
}

export default Subject