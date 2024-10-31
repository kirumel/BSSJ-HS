"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Autoplay } from "swiper/modules"; // Import the Autoplay module

SwiperCore.use([Autoplay]); // Use the Autoplay module

export default function Events() {
  return (
    <div>
      <div className="event-button-container">
        <button className="event-button" onClick={() => {}}>
          홈
        </button>
        <button className="event-button" onClick={() => {}}>
          이벤트
        </button>
        <button className="event-button" onClick={() => {}}>
          공부
        </button>
        <button className="event-button" onClick={() => {}}>
          관리자
        </button>
      </div>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        onSlideChange={(swiper) => console.log("slide change", swiper)}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
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
            <img className="home-event-img" src="logofull.jpg" alt="Slide 2" />
            <div className="event-overlay">
              <h2 className="event-title">이벤트 부분</h2>
              <p>이벤트 부분</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
