import event from "../event";
import Image from "next/image";
export default function indetail() {
  return (
    <>
      <div className="detail-title">
        <p>교내 행사 및 홍보</p>
      </div>
      <div className="home-layout">
        {event.map((event, i) => (
          <div className="main-container" key={i}>
            <Image
              src={event.img}
              width={1000}
              height={1000}
              className="event-img"
              alt="메인 배경 이미지"
            />
            <p>{event.title}</p>
          </div>
        ))}
      </div>
    </>
  );
}
