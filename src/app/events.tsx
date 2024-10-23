"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // 스타일을 불러옵니다
export default function Events() {
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      onSlideChange={(swiper) => console.log("slide change", swiper)}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
    >
      <SwiperSlide className="event-slide">
        <div style={{ width: "100%", height: "33vh" }}>
          <img className="home-event-img" src="altisto.png" alt="Slide 1" />
          <div className="event-overlay">
            <h2 className="event-title">beta test</h2>
            <p>version 1.2</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className="event-slide">
        <div style={{ width: "100%", height: "33vh" }}>
          <img className="home-event-img" src="logofull.jpg" alt="Slide 1" />
          <div className="event-overlay">
            <h2 className="event-title">이벤트 부분</h2>
            <p>이벤트 부분</p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
