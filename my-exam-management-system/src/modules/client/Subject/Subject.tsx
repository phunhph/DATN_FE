import { useNavigate } from 'react-router-dom';
import './Subject.scss'
import Slideshow from '@components/Slideshow/Slideshow';

const Subject = () => {

    const navigate = useNavigate();
    const handleClick = () => {
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
                <Slideshow images={images} />
            </div>
            {/*  */}
            <div className='Subject__group'>
                <h2>Môn thi</h2>
                <div className='group__content'>
                    <div className='group__item'>
                        <p>Tên kì thi</p>
                        <p>Tên Môn thi: <span className='item__span'>text</span></p>
                        <p>Mã Môn thi:<span className='item__span'>text</span></p>
                        <p>Số câu hỏi:<span className='item__span'>text</span></p>
                        <p>Thời gian bắt đầu:<span className='item__span'>text</span></p>
                        <p>Thời gian kết thúc:<span className='item__span'>text</span></p>
                        <p>Số lượng môn thi:<span className='item__span'>text</span></p>
                        <div className="cvo-progress">
                            <div className="cvo-block-title-underline completed"></div>
                            <div className="cvo-block-title-underline remaining"></div>
                        </div>
                        <button className='group__button' onClick={handleClick}>
                            Làm bài thi
                        </button>
                    </div>
                    <div className='group__item'>
                        <p>Tên kì thi</p>
                        <p>Tên Môn thi: <span className='item__span'>text</span></p>
                        <p>Mã Môn thi:<span className='item__span'>text</span></p>
                        <p>Số câu hỏi:<span className='item__span'>text</span></p>
                        <p>Thời gian bắt đầu:<span className='item__span'>text</span></p>
                        <p>Thời gian kết thúc:<span className='item__span'>text</span></p>
                        <p>Số lượng môn thi:<span className='item__span'>text</span></p>
                        <div className="cvo-progress">
                            <div className="cvo-block-title-underline completed"></div>
                            <div className="cvo-block-title-underline remaining"></div>
                        </div>
                        <button className='group__button' onClick={handleClick}>
                            Làm bài thi
                        </button>
                    </div>
                    <div className='group__item'>
                        <p>Tên kì thi</p>
                        <p>Tên Môn thi: <span className='item__span'>text</span></p>
                        <p>Mã Môn thi:<span className='item__span'>text</span></p>
                        <p>Số câu hỏi:<span className='item__span'>text</span></p>
                        <p>Thời gian bắt đầu:<span className='item__span'>text</span></p>
                        <p>Thời gian kết thúc:<span className='item__span'>text</span></p>
                        <p>Số lượng môn thi:<span className='item__span'>text</span></p>
                        <div className="cvo-progress">
                            <div className="cvo-block-title-underline completed"></div>
                            <div className="cvo-block-title-underline remaining"></div>
                        </div>
                        <button className='group__button' onClick={handleClick}>
                            Làm bài thi
                        </button>
                    </div>
                    <div className='group__item'>
                        <p>Tên kì thi</p>
                        <p>Tên Môn thi: <span className='item__span'>text</span></p>
                        <p>Mã Môn thi:<span className='item__span'>text</span></p>
                        <p>Số câu hỏi:<span className='item__span'>text</span></p>
                        <p>Thời gian bắt đầu:<span className='item__span'>text</span></p>
                        <p>Thời gian kết thúc:<span className='item__span'>text</span></p>
                        <p>Số lượng môn thi:<span className='item__span'>text</span></p>
                        <div className="cvo-progress">
                            <div className="cvo-block-title-underline completed"></div>
                            <div className="cvo-block-title-underline remaining"></div>
                        </div>

                        <button className='group__button' onClick={handleClick}>
                            Làm bài thi
                        </button>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Subject