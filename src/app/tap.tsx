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
  // {
  //   route: "/feed",
  //   icon: faHome,
  //   label: "피드",
  // },
  // {
  //   route: "/cafe",
  //   icon: faBowlFood,
  //   label: "커뮤니티",
  // },

  // {
  //   route: "/study",
  //   icon: faCalendarDays,
  //   label: "야자",
  // },

  {
    route: "/setting",
    icon: faUserCircle,
    label: "마이",
  },
];

export default tabs;
