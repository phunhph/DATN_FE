import { Button, CVO } from '@components/index';
import './Home.scss'
import Slideshow from '@components/Slideshow/Slideshow'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate()

  const images = [
    'https://via.placeholder.com/800x400?text=Banner+1',
    'https://via.placeholder.com/800x400?text=Banner+2',
    'https://via.placeholder.com/800x400?text=Banner+3'
  ];

  const goToSubject = () => {
    navigate("/client/subject")
  }

  return (
    <div className="Home__Client">
      <div className='Home__image'>
        <Slideshow images={images} />
      </div>
      <div className='Home__group'>
        <h1>Kỳ thi</h1>
        <div className='group__contentt'>
          <div className='group__itemm'>
            <p>Tên kì thi: <span className='item__span'>text</span></p>
            <p>Mã kì thi:<span className='item__span'>text</span></p>
            <p>Thời gian bắt đầu:<span className='item__span'>text</span></p>
            <p>Thời gian kết thúc:<span className='item__span'>text</span></p>
            <p>Số lượng môn thi:<span className='item__span'>text</span></p>
            <CVO percentage={50}></CVO>
            <Button onClick={goToSubject} className='client-group__button'>Vào kỳ thi</Button>
          </div>
          <div className='group__itemm'>
            <p>Tên kì thi: <span className='item__span'>text</span></p>
            <p>Mã kì thi:<span className='item__span'>text</span></p>
            <p>Thời gian bắt đầu:<span className='item__span'>text</span></p>
            <p>Thời gian kết thúc:<span className='item__span'>text</span></p>
            <p>Số lượng môn thi:<span className='item__span'>text</span></p>
            <CVO percentage={85}></CVO>
            <Button onClick={goToSubject} className='client-group__button'>Vào kỳ thi</Button>
          </div>
          <div className='group__itemm'>
            <p>Tên kì thi: <span className='item__span'>text</span></p>
            <p>Mã kì thi:<span className='item__span'>text</span></p>
            <p>Thời gian bắt đầu:<span className='item__span'>text</span></p>
            <p>Thời gian kết thúc:<span className='item__span'>text</span></p>
            <p>Số lượng môn thi:<span className='item__span'>text</span></p>
            <CVO percentage={35}></CVO>
            <Button onClick={goToSubject} className='client-group__button'>Vào kỳ thi</Button>
          </div>
          <div className='group__itemm'>
            <p>Tên kì thi: <span className='item__span'>text</span></p>
            <p>Mã kì thi:<span className='item__span'>text</span></p>
            <p>Thời gian bắt đầu:<span className='item__span'>text</span></p>
            <p>Thời gian kết thúc:<span className='item__span'>text</span></p>
            <p>Số lượng môn thi:<span className='item__span'>text</span></p>
            <CVO percentage={10}></CVO>

            <Button onClick={goToSubject} className='client-group__button'>Vào kỳ thi</Button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home