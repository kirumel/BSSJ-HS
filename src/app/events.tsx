"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Autoplay } from "swiper/modules";

SwiperCore.use([Autoplay]); // Use the Autoplay module

export default function Events() {
  const [eventState, setEventState] = useState("홈");

  return (
    <div>
      <div className="event-button-container">
        <button className="event-button" onClick={() => setEventState("홈")}>
          홈
        </button>
        <button
          onClick={() => setEventState("이벤트")}
          className="event-button"
        >
          이벤트
        </button>
        <button onClick={() => setEventState("공부")} className="event-button">
          공부
        </button>
        <button
          onClick={() => setEventState("관리자")}
          className="event-button"
        >
          관리자
        </button>
      </div>

      <div
        className={`event-container ${
          eventState === "홈" ? "collapse" : "expand"
        }`}
      >
        {eventState === "홈" ? (
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
              <div style={{ width: "100%", height: "100vh" }}>
                <img
                  className="home-event-img"
                  src="altisto.png"
                  alt="Slide 1"
                />
                <div className="event-overlay">
                  <h2 className="event-title">beta test</h2>
                  <p>version 1.2</p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide className="event-slide">
              <div style={{ width: "100%", height: "100vh" }}>
                <img
                  className="home-event-img"
                  src="logofull.jpg"
                  alt="Slide 2"
                />
                <div className="event-overlay">
                  <h2 className="event-title">이벤트 부분</h2>
                  <p>이벤트 부분</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        ) : null}
        {eventState === "이벤트" ? (
          <div className="event-title">이벤트 부분</div>
        ) : null}
        {eventState === "공부" ? (
          <div className="event-title">공부 부분</div>
        ) : null}
        {eventState === "관리자" ? (
          <div
            style={{
              width: "100%",
              backgroundColor: "",
            }}
            className="event-div expand"
          >
            <p>야미요</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
