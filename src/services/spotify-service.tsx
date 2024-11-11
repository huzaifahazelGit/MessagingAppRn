import { SPOTIFY_CLIENT_ID, SPOTIFY_SECRET } from "../constants/env";

export const getSpotifyTrack = (trackId: string, token: string) => {
  let promise = new Promise((resolve, reject) => {
    let url = `https://api.spotify.com/v1/tracks/${trackId}`;

    var headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    return fetch(url, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json);
      });
  });
  return promise;
};

export const generateSpotifyToken = () => {
  let promise = new Promise((resolve, reject) => {
    let url = `https://accounts.spotify.com/api/token?grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_SECRET}`;

    var headers = new Headers();
    headers.append("Content-Type", `application/x-www-form-urlencoded`);

    console.log("generateSpotifyToken");

    /**
   
curl -X POST "https://accounts.spotify.com/api/token" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=client_credentials&client_id=fceefe65c641426a8c3b0f41bb8cfb66&client_secret=a0f482edcb3d43aabee935f07969b980"
     */

    return fetch(url, {
      method: "POST",

      headers: headers,
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        if (json && json.access_token) {
          resolve(json.access_token);
        } else {
          resolve(null);
        }
      });
  });
  return promise;
};
