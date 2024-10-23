import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faBowlFood,
  faCalendarDays,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const maintabs = [
  {
    route: "../devcomment",
    icon: faCircleInfo,
    label: "앱 정보",
    color: "none",
    color2: "none",
    color3: "none",
  },
  {
    route: "../meals",
    icon: faBowlFood,
    label: "식단표",

    color: "none",
    color2: "none",
    color3: "none",
  },
  {
    route: "../schedules",
    icon: faCalendarDays,
    label: "시간표",
    color: "none",
    color2: "none",
    color3: "none",
  },
  {
    route: "/choiceAT",
    icon: faClock,
    label: "8교시 체크",
    type: "SJadmin",
    color: "none",
    color2: "none",
    color3: "none",
  },
  {
    route: "/schooltest",
    icon: faClock,
    label: "공지사항",
    color: "none",
    color2: "none",
    color3: "none",
  },
  {
    route: "https://www.hscredit.net/common/greeting.do",
    icon: faClock,
    label: "수강신청",
    color: "none",
    color2: "none",
    color3: "none",
  },
];

export default maintabs;
