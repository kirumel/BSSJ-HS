"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Autoplay } from "swiper/modules";
import { useSession } from "next-auth/react";

SwiperCore.use([Autoplay]);

export default function Events() {
  const { data: session } = useSession();
  return (
    <div>
      {session?.user?.role === "SjAdMin" ? (
        <div className="event-button-container">
          <a href="/admin">
            <button className="event-button">관리자</button>
          </a>
        </div>
      ) : (
        <div></div>
      )}

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
            <a href="/qrScan">
              <div style={{ width: "100%", height: "33vh" }}>
                <img
                  className="home-event-img"
                  src="logofull.jpg"
                  alt="Slide 2"
                />
                <div className="event-overlay">
                  <h2 className="event-title">event</h2>
                  <p>event</p>
                </div>
              </div>
            </a>
          </SwiperSlide>
        </Swiper>
      </div>
      <div
        style={{ marginRight: "1.5rem", marginLeft: "1.5rem" }}
        className="pad-display-none"
      >
        <div className="scroll-containercenter">
          <div className="scroll-container">
            <a href="/qrScan">
              <div className="main-event-imgbox">
                <img className="main-event-img" src="logofull.jpg"></img>
                <div
                  className="main-event-overlay2"
                  style={{ backgroundColor: "rgb(0, 0, 0)" }}
                ></div>
                <div
                  className="main-event-overlay1"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, transparent 48.15%, rgba(0, 0, 0) 94.91%)",
                    color: "white",
                  }}
                ></div>
                <p className="main-event-title" style={{ color: "white" }}>
                  event
                  <br />
                  event
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
