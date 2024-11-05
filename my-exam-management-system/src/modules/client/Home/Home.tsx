import { Button, CVO, GridItem } from '@components/index';
import './Home.scss'
import Slideshow from '@components/Slideshow/Slideshow'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate()

  const goToSubject = () => {
    navigate("/client/subject")
  }

  return (
    <div className="Home__Client">
      <div className='Home__image'>
        <Slideshow/>
      </div>
      <div className='Home__group'>
        <h2>Kỳ thi</h2>
        <div className='group__contentt'>
          <GridItem className='group__itemm'>
            <p>Tên kì thi: <span className='item__span'>WIN2024</span></p>
            <p>Mã kì thi:<span className='item__span'>MKT69413</span></p>
            <p>Thời gian bắt đầu:</p>
            <span className='item__span'> 03/11/2024</span>
            <p>Thời gian kết thúc:</p>
            <span className='item__span'>14/10/2024</span>
            <p>Số lượng môn thi:<span className='item__span'> 5</span></p>
            <CVO percentage={50}></CVO>
            <Button onClick={goToSubject}>Vào kỳ thi</Button>
          </GridItem>
          <GridItem className='group__itemm'>
            <p>Tên kì thi: <span className='item__span'>WIN2024</span></p>
            <p>Mã kì thi:<span className='item__span'>MKT69413</span></p>
            <p>Thời gian bắt đầu:</p>
            <span className='item__span'> 03/11/2024</span>
            <p>Thời gian kết thúc:</p>
            <span className='item__span'>14/10/2024</span>
            <p>Số lượng môn thi:<span className='item__span'> 5</span></p>
            <CVO percentage={85}></CVO>
            <Button onClick={goToSubject}>Vào kỳ thi</Button>
          </GridItem>
          <GridItem className='group__itemm'>
            <p>Tên kì thi: <span className='item__span'>WIN2024</span></p>
            <p>Mã kì thi:<span className='item__span'>MKT69413</span></p>
            <p>Thời gian bắt đầu:</p>
            <span className='item__span'> 03/11/2024</span>
            <p>Thời gian kết thúc:</p>
            <span className='item__span'>14/10/2024</span>
            <p>Số lượng môn thi:<span className='item__span'> 5</span></p>
            <CVO percentage={35}></CVO>
            <Button onClick={goToSubject}>Vào kỳ thi</Button>
          </GridItem>
          <GridItem className='group__itemm'>
            <p>Tên kì thi: <span className='item__span'>WIN2024</span></p>
            <p>Mã kì thi:<span className='item__span'>MKT69413</span></p>
            <p>Thời gian bắt đầu:</p>
            <span className='item__span'> 03/11/2024</span>
            <p>Thời gian kết thúc:</p>
            <span className='item__span'>14/10/2024</span>
            <p>Số lượng môn thi:<span className='item__span'> 5</span></p>
            <CVO percentage={35}></CVO>
            <Button onClick={goToSubject}>Vào kỳ thi</Button>
          </GridItem>
          </div>
        </div>
      </div>
  )
}

export default Home