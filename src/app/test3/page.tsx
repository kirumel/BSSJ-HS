import "./style.css";

export default function Component() {
  return (
    <div>
      <div className="card-container">
        <div className="card">
          <div className="card-face card-front">Front</div>
          <div className="card-face card-back">Back</div>
        </div>
      </div>
    </div>
  );
}
