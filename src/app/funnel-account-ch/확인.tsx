import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function StartRegister(props: any) {
  const { email, password, name, nickname, clss, grade } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [buttonComment, setButtonComment] = useState("");
  const [stage, setStage] = useState(1);
  const [isClicked, setIsClicked] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setButtonComment(showPassword ? "비밀번호 가리기" : "보기");
  }, [showPassword]);

  const handleSecondClick = () => {
    setIsClicked(true);
    if (email == undefined || password == undefined || name == undefined) {
      toast("데이터가 비어있습니다");
      setIsClicked(false);
    } else {
      axios
        .post("/api/post/chg", {
          email,
          password,
          name,
        })
        .then((res) => {
          if (res.status === 200) {
            toast("변경 완료되었습니다", { type: "success" });
          } else {
            toast("오류", { type: "error" });
            setIsClicked(false);
          }
        })
        .catch(() => {
          toast("서버 오류", { type: "error" });
          setIsClicked(false);
        });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        closeButton={false}
      />
      <div
        className="funnel-layout home-layout"
        style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}
      >
        <h5 style={{ textAlign: "center", marginBottom: "1px" }}>
          입력하신 정보를 확인해볼까요?
        </h5>
        <h5
          style={{ textAlign: "center", marginBottom: "2rem", color: "#666" }}
        >
          아래의 정보를 확인해주세요
        </h5>
        <div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              lineHeight: "2.2",
            }}
          >
            <li>
              <strong>이름:</strong> {name}
            </li>
            <li>
              <strong>이메일:</strong> {email}
            </li>
            <li>
              <strong>비밀번호:</strong> {showPassword ? password : "********"}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  marginLeft: "1rem",
                  background: "none",
                  border: "none",
                  color: "#4ea1ff",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {buttonComment}
              </button>
            </li>
          </ul>
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            className="ok-button"
            type="button"
            disabled={isClicked}
            onClick={handleSecondClick}
            style={{
              padding: "0.8rem 2rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: isClicked ? "#ccc" : "#4ea1ff",
              color: "white",
              fontWeight: "700",
              cursor: isClicked ? "not-allowed" : "pointer",
              fontSize: "1.1rem",
            }}
          >
            변경
          </button>
        </div>
      </div>
    </>
  );
}
