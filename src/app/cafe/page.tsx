import cafetap from "./cafetap";
import "./cafe.css";
import Cafe from "./cafe";
export default function Page() {
  return (
    <>
      <div className="cafe-pop">
        <div className="scroll-container padding1">
          {cafetap.map((array, i) => (
            <div className="scroll-list" key={i}>
              <div className="cafe-scroll-box">{array.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="line"></div>
      <div style={{ marginTop: "3rem" }}>
        <Cafe />
      </div>
    </>
  );
}
