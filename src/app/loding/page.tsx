export default function Loading() {
  return (
    <div className="loader-overlay" style={{ background: "none" }}>
      <div className="loader">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{ backgroundColor: "rgb(138, 156, 255)" }}
            className="dots"
          ></div>
        ))}
      </div>
    </div>
  );
}
