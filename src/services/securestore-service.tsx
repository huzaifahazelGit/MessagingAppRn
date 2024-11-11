import * as SecureStore from "expo-secure-store";
import { generateSpotifyToken } from "./spotify-service";

export const getSpotifyAccessToken = async () => {
  let token = await getValueFor("spotifyAccessToken");
  let tokenExpiration = await getValueFor("spotifyAccessTokenExpiration");
  let hasToken =
    token != null &&
    `${token}` != `undefined` &&
    `${token}` != `null` &&
    tokenExpiration != null &&
    `${tokenExpiration}` != `undefined`;

  if (hasToken) {
    if (new Date().getTime() > parseFloat(tokenExpiration)) {
      hasToken = false;
    }
  }

  if (hasToken) {
    return token;
  } else {
    return null;
  }
};

export const saveSpotifyAccessToken = async (session) => {
  let token = session.accessToken;
  let hasToken =
    token != null && `${token}` != `undefined` && `${token}` != `null`;

  if (hasToken) {
    save("spotifyAccessToken", token);
    save(
      "spotifyAccessTokenExpiration",
      session.expirationDate.getTime() + 3600000
    );
  }
};

export const getSpotifyGeneralToken = async () => {
  let token = await getValueFor("spotifyGeneralToken");
  let tokenExpiration = await getValueFor("spotifyGeneralTokenExpiration");
  let hasToken =
    token != null &&
    `${token}` != `undefined` &&
    `${token}` != `null` &&
    tokenExpiration != null &&
    `${tokenExpiration}` != `undefined`;

  if (hasToken) {
    if (new Date().getTime() > parseFloat(tokenExpiration)) {
      hasToken = false;
    }
  }

  if (hasToken) {
    return token;
  } else {
    let newToken = await generateSpotifyToken();
    if (newToken && `${newToken}` != `undefined` && `${newToken}` != `null`) {
      save("spotifyGeneralToken", newToken);
      save("spotifyGeneralTokenExpiration", new Date().getTime() + 3600000);
      return newToken;
    } else {
      return null;
    }
  }
};

async function save(key, value) {
  await SecureStore.setItemAsync(key, `${value}`);
}

async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

export const setInitialReferral = async (referringUserId: string) => {
  let alreadyReferred = await getCurrentReferrer();
  if (alreadyReferred == null || alreadyReferred == "") {
    await save("@realm_referringUserId", referringUserId);
  }
};

export const clearReferrer = async () => {
  await save("@realm_referringUserId", "");
};

export const getCurrentReferrer = async () => {
  const value = await getValueFor("@realm_referringUserId");
  return value || null;
};
