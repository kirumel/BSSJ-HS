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
    route: "/cafe",
    icon: faBowlFood,
    label: "커뮤니티",
  },
  {
    route: "/study",
    icon: faUserCircle,
    label: "공부",
  },
  {
    route: "/setting",
    icon: faUserCircle,
    label: "마이",
  },
];

export default tabs;
