import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BookIcon from "@mui/icons-material/Book";

export const loginButton = [
    {
      title: "Log In",
      path: "/login",
      icon: <LoginIcon />,
    },
  ];
  
  export const logoutButton = [
    {
      title: "Log Out",
      path: "/",
      icon: <LogoutIcon />,
    },
  ];



export const pages = [
  {
    title: "ΗΟΜΕ",
    path: "/",
    icon: <HomeIcon />,
  },
  {
    title: "SPACE",
    path: "/space",
    icon: <InfoIcon />,
  },
  {
    title: "BLOG",
    path: "/blog",
    icon: <BookIcon />,
  },
  {
    title: "TASK MANAGER",
    path: "/task-manager",
    icon: <BookIcon />,
  },
];