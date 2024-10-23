"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // 스타일을 불러옵니다
export default function Events() {
  return (
    <div>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        onSlideChange={(swiper) => console.log("slide change", swiper)}
      >
        <SwiperSlide className="event-slide">
          <img src="altisto.png" alt="Slide 1" />
          <div className="event-overlay">
            <h2>Event Slide 1 Title</h2>
            <p>Description for slide 1.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide className="event-slide">
          <img src="altisto.png" alt="Slide 2" />
          <div className="event-overlay">
            <h2>Event Slide 2 Title</h2>
            <p>Description for slide 2.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide className="event-slide">
          <img src="altisto.png" alt="Slide 3" />
          <div className="event-overlay">
            <h2>Event Slide 3 Title</h2>
            <p>Description for slide 3.</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
