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
    >
      <SwiperSlide className="event-slide">
        <div style={{ width: "100%", height: "40vh" }}>
          <img className="home-event-img" src="altisto.png" alt="Slide 1" />
          <div className="event-overlay">
            <h2 className="event-title">test1</h2>
            <p>폰 ui</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide className="event-slide">
        <div style={{ width: "100%", height: "40vh" }}>
          <img className="home-event-img" src="logofull.jpg" alt="Slide 1" />
          <div className="event-overlay">
            <h2 className="event-title">test2</h2>
            <p>test textarea</p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
