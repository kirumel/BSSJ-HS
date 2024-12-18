"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Autoplay } from "swiper/modules";

SwiperCore.use([Autoplay]); // Use the Autoplay module

export default function Events() {
  return (
    <div>
      <div className="event-button-container">
        <a href="/admin">
          <button className="event-button">관리자</button>
        </a>
      </div>

      <div className="phone-display-none">
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
                <h2 className="event-title">SJHS helper</h2>
                <p>정식 출시!</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="event-slide">
            <div style={{ width: "100%", height: "33vh" }}>
              <img
                className="home-event-img"
                src="logofull.jpg"
                alt="Slide 2"
              />
              <div className="event-overlay">
                <h2 className="event-title">성림축제 메이커부스</h2>
                <p>체험하고 음식받아가자!</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div
        style={{ marginRight: "1.5rem", marginLeft: "1.5rem" }}
        className="pad-display-none"
      >
        <div className="scroll-containercenter">
          <div className="scroll-container">
            <div className="main-event-imgbox">
              <img className="main-event-img" src="altisto.png"></img>
              <div
                className="main-event-overlay2"
                style={{ backgroundColor: "rgb(132, 146, 209)" }}
              ></div>
              <div
                className="main-event-overlay1"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, transparent 48.15%, rgba(132, 146, 209,1) 94.91%)",
                  color: "white",
                }}
              ></div>
              <p className="main-event-title" style={{ color: "white" }}>
                SJHS helper
                <br />
                정식 출시!
              </p>
            </div>
            <div className="main-event-imgbox">
              <img className="main-event-img" src="instagram-logo2.jpg"></img>
              <div
                className="main-event-overlay2"
                style={{ backgroundColor: "rgb(280,150,150)" }}
              ></div>
              <div
                className="main-event-overlay1"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, transparent 48.15%, rgba(280,150,150) 94.91%)",
                  color: "white",
                }}
              ></div>
              <p className="main-event-title" style={{ color: "white" }}>
                sjhs helper 인스타그램 홍보하고
                <br />
                치킨 받아가자!
              </p>
            </div>
            <div className="main-event-imgbox">
              <img className="main-event-img" src="main.jpg"></img>
              <div
                className="main-event-overlay2"
                style={{ backgroundColor: "rgb(280,160,160)" }}
              ></div>
              <div
                className="main-event-overlay1"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, transparent 48.15%, rgba(280,160,160) 94.91%)",
                  color: "white",
                }}
              ></div>
              <p className="main-event-title" style={{ color: "white" }}>
                성지고 교복 나눔제
                <br />
                관심있다면 클릭!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
