import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from "swiper";
import 'swiper/css';
import 'swiper/css/autoplay';
import { Fragment, useEffect, useState } from 'react';
import useApi from '../../../hooks/useApi';

const Categories = () => {
  const api = useApi();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, [])

  const getCategories = () => {
    api
      .categories()
      .then(res => {
        if (res?.status === 200 && res?.data) {
          setCategories(res?.data);
        }
      })
  }

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h4 className=" mb-0 cate-title">Category</h4>
        {/* <a href="favorite-menu.html" className="text-primary">View all <i className="fa-solid fa-angle-right ms-2"></i></a> */}
      </div>

      <Swiper
        spaceBetween={10}
        slidesPerView={6}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        autoplay={{
          delay: 2500,
          // disableOnInteraction: false,
        }}
        modules={[Autoplay]}
      >
        {categories.map((category, index) => {
          return <Fragment key={index}>
            <SwiperSlide>
                <div className="cate-bx text-center">
                <div className="card">
                  <div className="card-body">
                    <h6 className="mb-0 font-w500">{category?.name}</h6>
                  </div>
                </div>
                </div>
              </SwiperSlide>
            </Fragment>
        })}        
      </Swiper>
    </>
  );
}
 
export default Categories;