export default function Alertmodal(props: any) {
  console.log(props);
  return (
    <div className="alert-modal">
      <div className="alert-modal-content">
        <h5>{props.msg}</h5>
      </div>
    </div>
  );
}
