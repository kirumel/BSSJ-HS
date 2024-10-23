import { useEffect, useState } from "react";
import gsap from "gsap";
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
    if (showPassword) {
      setButtonComment("비밀번호 가리기");
    } else {
      setButtonComment("보기");
    }
  }, [showPassword]);

  useEffect(() => {
    gsap.fromTo(
      ".card",
      { x: 1000, scale: 0, opacity: 0, rotate: 100 },
      {
        backgroundColor: "rgb(30, 30, 30)",
        x: 0,
        scale: 0.8,
        opacity: 1,
        rotate: -10,
        duration: 1,
        ease: "power3.out",
      }
    );
    gsap.to(".card", {
      y: -30,
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "power1.inOut",
    });

    gsap.to(".card", {
      rotateY: "+=360",
      duration: 20,
      ease: "linear",
      repeat: -1,
    });
  }, []);

  const handleFirstClick = () => {
    gsap.killTweensOf(".card");

    gsap.to(".card", {
      y: -50,
      repeat: -1,

      yoyo: true,
      duration: 1,
      ease: "power1.inOut",
    });

    gsap.fromTo(
      ".grident",
      { opacity: 0 },
      {
        opacity: 0.3,
        scale: 2,
        duration: 2,
        ease: "power3.out",
      }
    );
    gsap.fromTo(
      "body",
      { backgroundColor: "white" },
      {
        backgroundColor: "#000000",
        duration: 1,
        ease: "power3.out",
      }
    );
    gsap.to(".card", {
      x: 0,
      scale: 1,
      rotate: 70,
      color: "white",
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      rotateY: 160,
      duration: 3,
      ease: "power3.out",
    });
    const tl = gsap.timeline({
      onComplete: () => {
        setStage(2);

        gsap.fromTo(
          ".start-register-title",
          { y: 100, opacity: 0, color: "white" },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
            color: "white",
          }
        );
      },
    });
    tl.to(".start-register-title", {
      y: -1000,
      opacity: 0,
      duration: 0.5,
      color: "white",
      ease: "power3.in",
    });
  };

  const handleSecondClick = () => {
    setIsClicked(true);
    if (
      email == undefined ||
      password == undefined ||
      name == undefined ||
      nickname == undefined ||
      clss == undefined ||
      grade == undefined
    ) {
      toast("데이터가 비어있습니다");
    } else {
      axios
        .post("/api/post/regist", {
          email,
          password,
          name,
          nickname,
          clss,
          grade,
        })
        .then((res) => {
          if (res.status === 200) {
            toast("회원가입이 완료되었습니다", { type: "success" });
            router.push("/success");
          } else {
            toast("오류", { type: "error" });
          }
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
      <video className="grident" autoPlay muted loop src="/grident.mp4" />
      <div className="funnel-layout home-layout">
        <div className="register-main">
          <h2 className="start-register-title">
            {stage === 1 ? (
              <>
                입력하신 사용자님의 정보를 <br />
                확인해볼까요?
              </>
            ) : (
              <>
                상세한 정보를
                <br />
                확인해주세요!
              </>
            )}
          </h2>
          <p className="subtitle">아래의 정보를 확인해주세요</p>
          <div className="card-display">
            <div className="card">
              <div className="card-face card-front">
                <div style={{ display: "flex", justifyContent: "right" }}>
                  <h1
                    style={{
                      marginTop: "3rem",
                      fontSize: "2.3rem",
                    }}
                  >
                    {name}
                  </h1>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <p className="subtitlewhite margin0">학년</p>
                  <p className="margintop0">{grade}</p>
                  <p className="subtitlewhite margin0">반</p>
                  <p className="margintop0">{clss}</p>
                  <p className="subtitlewhite margin0">닉네임</p>
                  <p className="margintop0">{nickname}</p>
                </div>
              </div>
              <div className="card-face card-back">
                <div className="회전display">
                  <div className="회전">
                    <div className="card-back-display">
                      <h3 className="card-back-title">
                        BSSJ {""}
                        {""} &gt;&gt;
                      </h3>
                      <div className="card-back-content">
                        <p className="subtitlewhite margin0">이름</p>
                        <p className="margintop0">{name}</p>
                        <p className="subtitlewhite margin0">이메일</p>
                        <p className="margintop0">{email}</p>
                        <p className="subtitlewhite margin0">비밀번호</p>
                        <p className="margintop0">
                          {showPassword ? <span>{password}</span> : null}
                          <span>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {buttonComment}
                            </button>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ok-button-div">
            <button
              className="ok-button"
              type="button"
              disabled={isClicked == true ? true : false}
              onClick={stage === 1 ? handleFirstClick : handleSecondClick}
            >
              {stage === 1 ? "확인하기" : "맞아요"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
