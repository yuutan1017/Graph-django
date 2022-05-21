import React from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/react-hooks";

import { Grid } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import styles from "./MainPage.module.css";
import { GET_MYPROFILE, GET_PROFILES, UPDATE_PROFILE } from "../queries";

const MainPage = () => {
  const history = useHistory();
  const { data: dataMyProfile, error: errorMyProfile } = useQuery(
    GET_MYPROFILE,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const { data: dataProfile, error: errorProfile } = useQuery(GET_PROFILES, {
    fetchPolicy: "cache-and-network",
  });
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const myFollowings = dataMyProfile?.profile.followings.edges.map(
    ({ node }) => node.id
  );

  // const changeFollow = ({node}) => {
  //   myFollowings?.includes(node.userProfile.id) ? unFollow : follow;
  // };

  // const unFollow = ({node}) => {
  //   updateProfile({
  //     variables: {
  //       id: dataMyProfile?.profile.id,
  //       followings: myFollowings.fillter((FId) => FId !== node.userProfile.id),
  //     },
  //   });
  // };

  // const follow = ({node}) => {
  //   updateProfile({
  //     variables: {
  //       id: dataMyProfile?.profile.id,
  //       followings: [...myFollowings, node.userProfile.id],
  //     },
  //   });
  // };

  return (
    <div className={styles.mainPage_root}>
      {(errorMyProfile || errorProfile) && (
        <h3>
          {errorProfile?.message}/{errorMyProfile?.message}
        </h3>
      )}
      <Grid container>
        <Grid item xs>
          {dataMyProfile?.profile.userProfile.username}
        </Grid>
        <Grid item xs>
          <span className={styles.mainPage_title}>Follow system</span>
        </Grid>
        <Grid item xs>
          <ExitToAppIcon
            className={styles.mainPage_out}
            onClick={() => {
              localStorage.removeItem("token");
              history.push("/");
            }}
          />
        </Grid>
        <Grid container>
          <Grid item xs={4}>
            <h3>Following</h3>
            <ul className={styles.mainPage_list}>
              {dataMyProfile?.profile.followings.edges.map(({ node }) => (
                <li className={styles.mainPage_item} key={node.id}>
                  {node.username}
                </li>
              ))}
            </ul>
          </Grid>
          <Grid item xs={4}>
            <h3>Profile List</h3>
            {dataProfile?.allProfiles.edges.map(
              ({ node }) =>
                node.id !== dataMyProfile?.profile.id && (
                  <li className={styles.mainPage_item} key={node.id}>
                    {node.userProfile.username}
                    <button
                      onClick={
                        myFollowings?.includes(node.userProfile.id)
                          ? () => {
                              updateProfile({
                                variables: {
                                  id: dataMyProfile?.profile.id,
                                  followings: myFollowings.filter(
                                    (followingId) =>
                                      followingId !== node.userProfile.id
                                  ),
                                },
                              });
                            }
                          : () => {
                              updateProfile({
                                variables: {
                                  id: dataMyProfile?.profile.id,
                                  followings: [
                                    ...myFollowings,
                                    node.userProfile.id,
                                  ],
                                },
                              });
                            }
                      }
                    >
                      {myFollowings?.includes(node.userProfile.id)
                        ? "unfollow"
                        : "follow"}
                    </button>
                  </li>
                )
            )}
          </Grid>
          <Grid item xs={4}>
            <h3>Followers</h3>
            <ul className={styles.mainPage_list}>
              {dataMyProfile?.profile.userProfile.profilesFollowings.edges.map(
                ({ node }) => (
                  <li
                    className={styles.mainPage_item}
                    key={node.userProfile.id}
                  >
                    {node.userProfile.username}
                  </li>
                )
              )}
            </ul>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default MainPage;
