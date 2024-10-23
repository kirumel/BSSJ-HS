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
    color: "gray",
    color2: "white",
    color3: "white",
  },
  {
    route: "../meals",
    icon: faBowlFood,
    label: "식단표",

    color: "gray",
    color2: "white",
    color3: "white",
  },
  {
    route: "../schedules",
    icon: faCalendarDays,
    label: "시간표",
    color: "gray",
    color2: "white",
    color3: "white",
  },
  {
    route: "/choiceAT",
    icon: faClock,
    label: "8교시 체크",
    type: "SJadmin",
    color: "gray",
    color2: "white",
    color3: "white",
  },
  {
    route: "/schooltest",
    icon: faClock,
    label: "공지사항",
    color: "gray",
    color2: "white",
    color3: "white",
  },
  {
    route: "https://www.hscredit.net/common/greeting.do",
    icon: faClock,
    label: "수강신청",
    color: "gray",
    color2: "white",
    color3: "white",
  },
];

export default maintabs;
