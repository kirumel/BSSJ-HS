"use client";
import "./page.css";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back(); // 브라우저 히스토리의 이전 페이지로 이동
  };
  return (
    <div className="right-left-margin home-layout">
      <button className="back-button" onClick={handleBackClick}>
        <span>&larr;</span>
      </button>
      <strong>Altisto 개인정보처리방침</strong>
      <p>
        본 개인정보처리방침은 모바일 장치용 SJHS-앱(이하 "애플리케이션")에
        적용되며, Altisto(이하 "서비스 제공자")가 제공하는 무료 서비스로, "있는
        그대로"의 상태로 제공됩니다.
      </p>

      <br />

      <strong>정보 수집 및 이용</strong>
      <p>
        애플리케이션은 사용자가 다운로드하고 이용할 때 정보를 수집합니다. 이
        정보는 다음과 같은 세부사항을 포함할 수 있습니다:
      </p>
      <ul>
        <li>사용자의 장치의 인터넷 프로토콜 주소(IP 주소 등)</li>
        <li>
          사용자가 방문한 애플리케이션의 페이지, 방문 시간 및 날짜, 해당
          페이지에 머문 시간
        </li>
        <li>애플리케이션 사용 시간</li>
        <li>사용자가 모바일 장치에서 사용하는 운영 체제</li>
      </ul>

      <br />

      <p>
        애플리케이션은 사용자의 모바일 장치의 정확한 위치 정보를 수집하지
        않습니다.
      </p>

      <br />

      <p>
        서비스 제공자는 사용자에게 중요한 정보, 필수 공지사항 및 마케팅
        프로모션을 제공하기 위해 사용자가 제공한 정보를 사용할 수 있습니다.
      </p>

      <br />

      <p>
        애플리케이션 사용 중 더 나은 경험을 제공하기 위해 서비스 제공자는
        이메일, 사용자 ID, 이름, 비밀번호, 프로필 이미지 등과 같은 개인 식별
        정보를 요구할 수 있습니다. 서비스 제공자가 요청하는 정보는 본
        개인정보처리방침에 설명된 대로 보유 및 사용됩니다.
      </p>

      <br />

      <strong>제삼자 접근</strong>
      <p>
        서비스 제공자는 애플리케이션 및 서비스 개선을 위해 주기적으로 집계된
        익명 데이터를 외부 서비스에 전송할 수 있습니다. 서비스 제공자는 본
        개인정보처리방침에 설명된 대로 사용자의 정보를 제삼자와 공유할 수
        있습니다.
      </p>

      <br />

      <p>
        애플리케이션은 데이터 처리에 관한 자체 개인정보처리방침을 가진 제삼자
        서비스를 사용합니다. 아래는 애플리케이션에서 사용하는 제삼자 서비스
        제공자의 개인정보처리방침 링크입니다:
      </p>
      <ul>
        <li>
          <a
            href="https://www.google.com/policies/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Play 서비스
          </a>
        </li>
        <li>
          <a
            href="https://support.google.com/admob/answer/6128543?hl=ko"
            target="_blank"
            rel="noopener noreferrer"
          >
            AdMob
          </a>
        </li>
        <li>
          <a
            href="https://expo.dev/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Expo
          </a>
        </li>
      </ul>

      <br />

      <p>
        서비스 제공자는 사용자 제공 정보와 자동으로 수집된 정보를 다음과 같이
        공개할 수 있습니다:
      </p>
      <ul>
        <li>
          서비스 제공자가 권리를 보호하고 사용자 또는 타인의 안전을 보호하며,
          사기 행위를 조사하고, 정부 요청에 대응하기 위해 공개가 필요하다고
          선의로 판단할 때;
        </li>
        <li>
          서비스 제공자를 대신해 일하는 신뢰할 수 있는 서비스 제공자와,
          독립적으로 정보를 사용할 수 없으며 본 개인정보처리방침에 명시된 규칙을
          준수하는 서비스 제공자와 공유할 때.
        </li>
      </ul>

      <br />

      <strong>Opt-Out Rights</strong>
      <p>
        사용자는 애플리케이션을 쉽게 제거함으로써 모든 정보 수집을 중단할 수
        있습니다. 사용자는 모바일 장치의 표준 제거 프로세스 또는 모바일
        애플리케이션 마켓플레이스 또는 네트워크를 통해 제거할 수 있습니다.
      </p>

      <br />

      <strong>데이터 보존 정책</strong>
      <p>
        서비스 제공자는 사용자가 애플리케이션을 사용하는 동안과 그 이후 합리적인
        기간 동안 사용자 제공 데이터를 보존할 것입니다. 애플리케이션을 통해
        제공한 사용자 제공 데이터를 삭제하고 싶으시면,{" "}
        <a href="mailto:admin@altisto.me">admin@altisto.me</a>로 연락 주시면
        합리적인 시간 내에 응답하겠습니다.
      </p>

      <br />

      <strong>어린이 보호정책</strong>
      <p>
        서비스 제공자는 애플리케이션을 통해 13세 미만의 아동으로부터 데이터를
        의도적으로 수집하거나 마케팅하지 않습니다. 애플리케이션은 13세 미만의
        사용자를 대상으로 하지 않습니다. 서비스 제공자는 13세 미만 아동의 개인
        식별 정보를 의도적으로 수집하지 않습니다. 만약 서비스 제공자가 13세 미만
        아동이 개인 정보를 제공했다는 사실을 알게 될 경우, 이를 즉시 서버에서
        삭제할 것입니다. 부모나 보호자 분들께서 자녀가 개인 정보를 제공했다는
        사실을 알고 계신 경우,{" "}
        <a href="mailto:admin@altisto.me">admin@altisto.me</a>로 연락해 주시기
        바랍니다.
      </p>

      <br />

      <strong>보안정책</strong>
      <p>
        서비스 제공자는 사용자의 정보 기밀성을 보호하는 데 최선을 다하고
        있습니다. 서비스 제공자는 처리 및 유지 관리하는 정보 보호를 위해 물리적,
        전자적 및 절차적 보호 조치를 제공합니다.
      </p>

      <br />

      <strong>정책 변경 사항</strong>
      <p>
        본 개인정보처리방침은 이유 여하를 막론하고 수시로 업데이트될 수
        있습니다. 서비스 제공자는 본 페이지를 통해 새로운 개인정보처리방침을
        게시하여 변경 사항을 사용자에게 알릴 것입니다. 변경 사항에 대한 정보를
        정기적으로 확인하시기 바랍니다. 계속해서 애플리케이션을 사용하는 것은
        모든 변경 사항에 동의한 것으로 간주됩니다.
      </p>

      <br />

      <p>본 개인정보처리방침은 2024년 9월 1일부터 시행됩니다.</p>

      <br />

      <strong>사용자의 동의</strong>
      <p>
        애플리케이션을 사용함으로써 사용자는 현재 및 향후 수정된 본
        개인정보처리방침에 명시된 대로 정보 처리에 동의하게 됩니다.
      </p>

      <br />

      <strong>문의하기</strong>
      <p>
        애플리케이션 사용 중 개인정보 보호에 관해 질문이 있거나 서비스 제공자의
        정책에 대해 궁금한 점이 있으시면,{" "}
        <a href="mailto:admin@altisto.me">admin@altisto.me</a>로 연락해 주시기
        바랍니다.
      </p>

      <hr />

      <h3>english</h3>
      <br />
      <div>
        <strong>Privacy Policy</strong>
        <p>
          This privacy policy applies to the SJHS-app (hereby referred to as
          "Application") for mobile devices created by Altisto (hereby referred
          to as "Service Provider") as a Free service. This service is intended
          for use "AS IS".
        </p>

        <br />

        <strong>Information Collection and Use</strong>
        <p>
          The Application collects information when you download and use it.
          This information may include details such as:
        </p>
        <ul>
          <li>Your device's Internet Protocol address (e.g., IP address)</li>
          <li>
            The pages of the Application that you visit, the time and date of
            your visit, and the time spent on those pages
          </li>
          <li>The time spent on the Application</li>
          <li>The operating system you use on your mobile device</li>
        </ul>

        <br />

        <p>
          The Application does not gather precise information about the location
          of your mobile device.
        </p>

        <br />

        <p>
          The Service Provider may use the information you provide to contact
          you from time to time to provide you with important information,
          required notices, and marketing promotions.
        </p>

        <br />

        <p>
          For a better experience while using the Application, the Service
          Provider may require you to provide certain personally identifiable
          information, including but not limited to email, userId, name,
          password, and profileImage. The information that the Service Provider
          requests will be retained and used as described in this privacy
          policy.
        </p>

        <br />

        <strong>Third Party Access</strong>
        <p>
          Only aggregated, anonymized data is periodically transmitted to
          external services to aid the Service Provider in improving the
          Application and their services. The Service Provider may share your
          information with third parties as described in this privacy statement.
        </p>

        <br />

        <p>
          Please note that the Application utilizes third-party services that
          have their own Privacy Policy regarding the handling of data. Below
          are the links to the Privacy Policy of the third-party service
          providers used by the Application:
        </p>
        <ul>
          <li>
            <a
              href="https://www.google.com/policies/privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Play Services
            </a>
          </li>
          <li>
            <a
              href="https://support.google.com/admob/answer/6128543?hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              AdMob
            </a>
          </li>
          <li>
            <a
              href="https://expo.io/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Expo
            </a>
          </li>
        </ul>

        <br />

        <p>
          The Service Provider may disclose User Provided and Automatically
          Collected Information:
        </p>
        <ul>
          <li>
            as required by law, such as to comply with a subpoena or similar
            legal process;
          </li>
          <li>
            when they believe in good faith that disclosure is necessary to
            protect their rights, protect your safety or the safety of others,
            investigate fraud, or respond to a government request;
          </li>
          <li>
            with their trusted service providers who work on their behalf, do
            not have an independent use of the information disclosed to them,
            and have agreed to adhere to the rules set forth in this privacy
            statement.
          </li>
        </ul>

        <br />

        <strong>Opt-Out Rights</strong>
        <p>
          You can stop all collection of information by the Application easily
          by uninstalling it. You may use the standard uninstall processes
          available as part of your mobile device or via the mobile application
          marketplace or network.
        </p>

        <br />

        <strong>Data Retention Policy</strong>
        <p>
          The Service Provider will retain User Provided data for as long as you
          use the Application and for a reasonable time thereafter. If you'd
          like them to delete User Provided Data that you have provided via the
          Application, please contact them at{" "}
          <a href="mailto:admin@altisto.me">admin@altisto.me</a> and they will
          respond in a reasonable time.
        </p>

        <br />

        <strong>Children</strong>
        <p>
          The Service Provider does not use the Application to knowingly solicit
          data from or market to children under the age of 13. The Application
          does not address anyone under the age of 13. The Service Provider does
          not knowingly collect personally identifiable information from
          children under 13 years of age. In the case the Service Provider
          discovers that a child under 13 has provided personal information,
          they will immediately delete this from their servers. If you are a
          parent or guardian and are aware that your child has provided us with
          personal information, please contact the Service Provider at{" "}
          <a href="mailto:admin@altisto.me">admin@altisto.me</a> so that they
          can take the necessary actions.
        </p>

        <br />

        <strong>Security</strong>
        <p>
          The Service Provider is concerned about safeguarding the
          confidentiality of your information. They provide physical,
          electronic, and procedural safeguards to protect information that they
          process and maintain.
        </p>

        <br />

        <strong>Changes</strong>
        <p>
          This Privacy Policy may be updated from time to time for any reason.
          The Service Provider will notify you of any changes by updating this
          page with the new Privacy Policy. You are advised to consult this
          Privacy Policy regularly for any changes, as continued use is deemed
          approval of all changes.
        </p>

        <br />

        <p>This privacy policy is effective as of 2024-09-01</p>

        <br />

        <strong>Your Consent</strong>
        <p>
          By using the Application, you are consenting to the processing of your
          information as set forth in this Privacy Policy now and as amended by
          us.
        </p>

        <br />

        <strong>Contact Us</strong>
        <p>
          If you have any questions regarding privacy while using the
          Application, or have questions about our practices, please contact the
          Service Provider via email at{" "}
          <a href="mailto:admin@altisto.me">admin@altisto.me</a>.
        </p>

        <hr />
      </div>
    </div>
  );
}
