export default function SessionDelete() {
  return (
    <div className="scroll-containercenter">
      <div className="scroll-container">
        <div className="scroll-list">
          {maintaps.map((tab, index) => (
            <a href={tab.route} className="box" key={index}>
              <div className="maintab-container">
                <FontAwesomeIcon className="maintab-icon" icon={tab.icon} />
                <div className="maintab-label">{tab.label}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
