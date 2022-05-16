import React from "react";
import { useHistory } from "react-router-dom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import styles from "./MainPage.module.css";

const MainPage = () => {
  const history = useHistory();
  return (
    <div>
      <ExitToAppIcon
        className={styles.mainPage_out}
        onClick={() => {
          localStorage.removeItem("token");
          history.push("/");
        }}
      />
    </div>
  );
};

export default MainPage;
