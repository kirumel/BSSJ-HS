import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlFood,
  faHome,
  faUserCircle,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

const tabs = [
  {
    route: "/",
    icon: faHome,
    label: "홈",
  },
  {
    route: "/meals",
    icon: faBowlFood,
    label: "식단표",
  },
  {
    route: "/schedules",
    icon: faCalendarDays,
    label: "시간표",
  },
  {
    route: "/cafe",
    icon: faBowlFood,
    label: "커뮤니티",
  },
  {
    route: "/setting",
    icon: faUserCircle,
    label: "마이",
  },
];

export default tabs;
