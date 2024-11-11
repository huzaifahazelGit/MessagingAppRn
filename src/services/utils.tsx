export function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export const containsAll = (arr1, arr2) =>
  arr2.every((arr2Item) => arr1.includes(arr2Item));

export const sameMembers = (arr1, arr2) =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1);

export const getResizedImage = (image: string) => {
  if (image && `${image}`.includes("/posts%2F")) {
    let parts = image.split("/posts%2F");
    if (parts.length > 1) {
      let parts2 = parts[1].split(".");
      if (parts2.length > 0) {
        let storageName = parts2[0];
        return image.replace(storageName, `${storageName}_450x450`);
      }
    }
  }

  return image;

  // return post.image.replace(
  //   "https://firebasestorage.googleapis.com/",
  //   IMAGEKIT_FULL_REPLACE
  // );
};

export const getResizedProfileImage = (image: string) => {
  if (image && `${image}`.includes("/users%2F")) {
    let parts = image.split("/users%2F");
    if (parts.length > 1) {
      let parts2 = parts[1].split(".");
      if (parts2.length > 0) {
        let storageName = parts2[0];
        return image.replace(storageName, `${storageName}_200x200`);
      }
    }
  }

  return image;

  // return post.image.replace(
  //   "https://firebasestorage.googleapis.com/",
  //   IMAGEKIT_SMALL_REPLACE
  // );
};

export const millisToMin = (millis: number) => {
  var minutes = Math.floor(millis / 60);
  var seconds = parseInt((millis % 60).toFixed(0));
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

export function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

export function onlyUniqueIds(value, index, array) {
  return array.map((item) => item.id).indexOf(value.id) === index;
}

export const textHasLink = (text: string) => {
  let kLINK_DETECTION_REGEX = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  let matches = text.match(kLINK_DETECTION_REGEX);
  return matches && (matches || []).length > 0;
};

export const cleanLink = (link: string, kind: string) => {
  const isValid = link.includes("https://") || link.includes("http://");
  if (isValid) {
    return link;
  }
  if (kind === "spotify") {
    return link;
  } else if (kind === "instagram") {
    if (link.includes("@")) {
      return `https://www.instagram.com/${link.replace("@", "")}/`;
    } else {
      return `https://www.instagram.com/${link}/`;
    }
  } else if (kind === "soundcloud") {
    return `https://soundcloud.com/${link}`;
  } else if (kind === "youtube") {
    if (link.includes("@")) {
      return `https://www.youtube.com/${link}`;
    } else {
      return `https://www.youtube.com/@${link}`;
    }
  } else if (kind === "website") {
    if (!link.includes("www")) {
      return `http://www.${link}`;
    } else {
      return `http://${link}`;
    }
  }
  return link;
};
