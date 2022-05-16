import React, { useState } from "react";
import styles from "./Auth.module.css";

import FlipCameraAndroid from "@material-ui/icons/FlipCameraAndroid";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { GET_TOKEN, CREATE_USER, CREATE_PROFILE } from "../queries";

const Auth = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [getToken] = useMutation(GET_TOKEN);
  const [createUser] = useMutation(CREATE_USER);
  const [createProfile] = useMutation(CREATE_PROFILE);
  const [isLogin, setIsLogin] = useState(true);

  const login = async () => {
    try {
      const result = await getToken({
        variables: { username: username, password: password },
      });
      localStorage.setItem("token", result.data.tokenAuth.token);
      if (!isLogin) {
        await createProfile();
      }
      history.push("/top");
    } catch {
      alert("Faild Login");
    }
  };

  const authUser = async (e) => {
    e.preventDefault();
    if (isLogin) {
      login();
    } else {
      try {
        await createUser({
          variables: { username: username, password: password },
        });
        login();
      } catch {
        alert("Faild Create");
      }
    }
  };

  return (
    <div className={styles.auth}>
      <form onSubmit={authUser}>
        <div className={styles.auth_input}>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.auth_input}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">
          {isLogin ? "Login" : "Create User"}
        </button>
        <div>
          <FlipCameraAndroid
            className={styles.auth_toggle}
            onClick={() => setIsLogin(!isLogin)}
          />
        </div>
      </form>
    </div>
  );
};

export default Auth;
