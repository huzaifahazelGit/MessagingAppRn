import { TYPESENSE_KEY, TYPESENSE_CLUSTER } from "../constants/env";

// const SEARCH_URL_BASE =
//   "https://kuf2or3igehdsq6lp-1.a1.typesense.net:443/collections";

const SEARCH_URL_BASE = `https://${TYPESENSE_CLUSTER}:443/collections`;

export const getTSHeaders = () => {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("X-TYPESENSE-API-KEY", TYPESENSE_KEY);
  return headers;
};

export const fetchTypesenseFollows = (
  myFollowedUserIds: string[],
  userId: string
) => {
  let promise = new Promise((resolve, reject) => {
    let filterBy = `toUserId:${userId}`;
    // let filterBy = `toUserId:${userId}&fromUserId:[`;
    // myFollowedUserIds.forEach((userId, index) => {
    //   if (index == 0) {
    //     filterBy = `${filterBy}${userId}`;
    //   } else {
    //     filterBy = `${filterBy},${userId}`;
    //   }
    // });
    // filterBy = `${filterBy}]`;

    let base = `${SEARCH_URL_BASE}/follows/documents/search?per_page=100`;
    let url = `${base}&filter_by=${filterBy}&q=*`;

    return fetch(url, {
      method: "GET",
      headers: getTSHeaders(),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.hits) {
          let hits = json.hits;

          resolve({ mutuals: hits.map((item) => item.document) });
        } else {
          resolve({ mutuals: [] });
        }
      });
  });
  return promise;
};

export const tagSearch = (
  docType: "users" | "challenges" | "posts" | "marketplace",
  searchVal: string
) => {
  let promise = new Promise((resolve, reject) => {
    let queryBy = "tags";

    let base = `${SEARCH_URL_BASE}/${docType}/documents/search?per_page=25&`;

    let tagsUrl = `${base}query_by=${queryBy}&q=${searchVal}`;

    return fetch(tagsUrl, {
      method: "GET",
      headers: getTSHeaders(),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.hits) {
          let tags = getTagsFromHits(json.hits, searchVal, []);

          resolve({ docs: [], highlights: tags });
        } else {
          resolve({ docs: [], highlights: [] });
        }
      });
  });
  return promise;
};

export const typesenseSearch = async (
  docType:
    | "users"
    | "companies"
    | "playlists"
    | "challenges"
    | "posts"
    | "marketplace"
    | "audio"
    | "video",
  searchVal: string,
  queryTags: string[],
  location?: string,
  cosignedBy?: string,
  budget?: number,
  includeAll?: boolean
) => {
  switch (docType) {
    case "users":
      return await typesenseSearchUsers(
        searchVal,
        queryTags,
        location,
        cosignedBy
      );
    case "companies":
      return await typesenseSearchCompanies(
        searchVal,
        queryTags,
        location,
        cosignedBy
      );
    case "playlists":
      return await typesenseSearchPlaylists(searchVal, queryTags, location);
    case "challenges":
    // tara later
    case "posts":
      return await typesenseSearchPosts(searchVal, queryTags);
    case "marketplace":
      return await typesenseSearchMarketplace(
        searchVal,
        queryTags,
        location,
        budget
      );
    case "audio":
      return await typesenseSearchAudio(searchVal, queryTags);
    case "video":
      return await typesenseSearchVideo(searchVal, queryTags);
  }
};

const typesenseSearchMarketplace = (
  searchVal: string,
  queryTags: string[],
  location?: string,
  budget?: number
) => {
  var finalSearchVal = searchVal;
  let promise = new Promise((resolve, reject) => {
    let queryBy = "tags,description";

    let filterBy = `archived:false`;
    if (queryTags.length > 0) {
      filterBy = `&&tags:[`;
      queryTags.forEach((tag, index) => {
        if (index == 0) {
          filterBy = `${filterBy}${tag}`;
        } else {
          filterBy = `${filterBy},${tag}`;
        }
      });
      filterBy = `${filterBy}]`;
    }

    if (budget > 0) {
      filterBy = `${filterBy}&&budget:${budget}`;
    }

    let base = `${SEARCH_URL_BASE}/marketplace/documents/search?per_page=25&`;
    let url = `${base}query_by=${queryBy}&q=${finalSearchVal}`;
    if (filterBy) {
      url = `${url}&filter_by=${filterBy}`;
    }

    if (location) {
      if (finalSearchVal == "") {
        finalSearchVal = `${location}`;
      } else {
        finalSearchVal = `${finalSearchVal} ${location}`;
        // filterBy = `${filterBy}&&location:${location}`;
      }
    }

    // console.log("url", url);

    return fetch(url, {
      method: "GET",
      headers: getTSHeaders(),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.hits) {
          let docs = getDocsFromHits(json.hits, finalSearchVal, queryTags);

          resolve({ docs: docs, highlights: [] });
        } else {
          resolve({ docs: [], highlights: [] });
        }
      });
  });
  return promise;
};

const typesenseSearchAudio = (
  searchVal: string,
  queryTags: string[],
  location?: string
) => {
  var finalSearchVal = searchVal;
  let promise = new Promise((resolve, reject) => {
    let queryBy = "tags,description,uploadTitle,username";

    let filterBy = `archived:false&&reposted:false`;
    if (queryTags.length > 0) {
      filterBy = `&&tags:[`;
      queryTags.forEach((tag, index) => {
        if (index == 0) {
          filterBy = `${filterBy}${tag}`;
        } else {
          filterBy = `${filterBy},${tag}`;
        }
      });
      filterBy = `${filterBy}]`;
    }

    filterBy = `${filterBy}&&kind:audio`;

    let base = `${SEARCH_URL_BASE}/posts/documents/search?per_page=25&`;
    let url = `${base}query_by=${queryBy}&q=${finalSearchVal}`;
    if (filterBy) {
      url = `${url}&filter_by=${filterBy}`;
    }

    // console.log("url", url);

    return fetch(url, {
      method: "GET",
      headers: getTSHeaders(),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.hits) {
          let docs = getDocsFromHits(json.hits, finalSearchVal, queryTags);

          resolve({ docs: docs, highlights: [] });
        } else {
          resolve({ docs: [], highlights: [] });
        }
      });
  });
  return promise;
};

const typesenseSearchVideo = (
  searchVal: string,
  queryTags: string[],
  location?: string
) => {
  var finalSearchVal = searchVal;
  let promise = new Promise((resolve, reject) => {
    let queryBy = "tags,description,username";

    let filterBy = `archived:false&&reposted:false`;
    if (queryTags.length > 0) {
      filterBy = `&&tags:[`;
      queryTags.forEach((tag, index) => {
        if (index == 0) {
          filterBy = `${filterBy}${tag}`;
        } else {
          filterBy = `${filterBy},${tag}`;
        }
      });
      filterBy = `${filterBy}]`;
    }

    filterBy = `${filterBy}&&kind:video`;

    let base = `${SEARCH_URL_BASE}/posts/documents/search?per_page=25&`;
    let url = `${base}query_by=${queryBy}&q=${finalSearchVal}`;
    if (filterBy) {
      url = `${url}&filter_by=${filterBy}`;
    }

    // console.log("url", url);

    return fetch(url, {
      method: "GET",
      headers: getTSHeaders(),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.hits) {
          let docs = getDocsFromHits(json.hits, finalSearchVal, queryTags);

          resolve({ docs: docs, highlights: [] });
        } else {
          resolve({ docs: [], highlights: [] });
        }
      });
  });
  return promise;
};

const typesenseSearchPosts = (
  searchVal: string,
  queryTags: string[],
  location?: string
) => {
  var finalSearchVal = searchVal;
  let promise = new Promise((resolve, reject) => {
    let queryBy = "tags,description,username";

    let filterBy = `archived:false&&reposted:false`;
    if (queryTags.length > 0) {
      filterBy = `&&tags:[`;
      queryTags.forEach((tag, index) => {
        if (index == 0) {
          filterBy = `${filterBy}${tag}`;
        } else {
          filterBy = `${filterBy},${tag}`;
        }
      });
      filterBy = `${filterBy}]`;
    }

    let base = `${SEARCH_URL_BASE}/posts/documents/search?per_page=25&`;
    let url = `${base}query_by=${queryBy}&q=${finalSearchVal}`;
    if (filterBy) {
      url = `${url}&filter_by=${filterBy}`;
    }

    // console.log("url", url);

    return fetch(url, {
      method: "GET",
      headers: getTSHeaders(),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.hits) {
          let docs = getDocsFromHits(json.hits, finalSearchVal, queryTags);

          resolve({ docs: docs, highlights: [] });
        } else {
          resolve({ docs: [], highlights: [] });
        }
      });
  });
  return promise;
};

const typesenseSearchCompanies = (
  searchVal: string,
  queryTags: string[],
  location?: string,
  cosignedBy?: string
) => {
  var finalSearchVal = searchVal;
  let promise = new Promise((resolve, reject) => {
    let queryBy = "bio,name";

    let filterBy = "";
    if (queryTags.length > 0) {
      filterBy = `tags:[`;
      queryTags.forEach((tag, index) => {
        if (index == 0) {
          filterBy = `${filterBy}${tag}`;
        } else {
          filterBy = `${filterBy},${tag}`;
        }
      });
      filterBy = `${filterBy}]`;
    }
    if (location) {
      if (finalSearchVal == "") {
        finalSearchVal = `${location}`;
      } else {
        finalSearchVal = `${finalSearchVal} ${location}`;
        // filterBy = `${filterBy}&&location:${location}`;
      }
    }

    let base = `${SEARCH_URL_BASE}/companies/documents/search?per_page=25&`;
    let url = `${base}query_by=${queryBy}&q=${finalSearchVal}`;
    if (filterBy) {
      url = `${url}&filter_by=${filterBy}`;
    }

    // console.log("url", url);

    return fetch(url, {
      method: "GET",
      headers: getTSHeaders(),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.hits) {
          let docs = getDocsFromHits(json.hits, finalSearchVal, queryTags);

          resolve({ docs: docs, highlights: [] });
        } else {
          resolve({ docs: [], highlights: [] });
        }
      });
  });
  return promise;
};

const typesenseSearchPlaylists = (
  searchVal: string,
  queryTags: string[],
  location?: string
) => {
  var finalSearchVal = searchVal;
  let promise = new Promise((resolve, reject) => {
    let queryBy = "ownerName,name";

    let filterBy = "songCount:>0";
    if (queryTags.length > 0) {
      filterBy = `&&tags:[`;
      queryTags.forEach((tag, index) => {
        if (index == 0) {
          filterBy = `${filterBy}${tag}`;
        } else {
          filterBy = `${filterBy},${tag}`;
        }
      });
      filterBy = `${filterBy}]`;
    }
    if (location) {
      if (finalSearchVal == "") {
        finalSearchVal = `${location}`;
      } else {
        finalSearchVal = `${finalSearchVal} ${location}`;
        // filterBy = `${filterBy}&&location:${location}`;
      }
    }

    let base = `${SEARCH_URL_BASE}/playlists/documents/search?per_page=25&`;
    let url = `${base}query_by=${queryBy}&q=${finalSearchVal}`;
    if (filterBy) {
      url = `${url}&filter_by=${filterBy}`;
    }

    // console.log("url", url);

    return fetch(url, {
      method: "GET",
      headers: getTSHeaders(),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.hits) {
          let docs = getDocsFromHits(json.hits, finalSearchVal, queryTags);

          resolve({ docs: docs, highlights: [] });
        } else {
          resolve({ docs: [], highlights: [] });
        }
      });
  });
  return promise;
};

const typesenseSearchUsers = (
  searchVal: string,
  queryTags: string[],
  location?: string,
  cosignedBy?: string,
  includeAll?: boolean
) => {
  var finalSearchVal = searchVal;
  let promise = new Promise((resolve, reject) => {
    let queryBy = "tags,username,location";
    let filterBy = "";
    if (queryTags.length > 0) {
      filterBy = `tags:[`;
      queryTags.forEach((tag, index) => {
        if (index == 0) {
          filterBy = `${filterBy}${tag}`;
        } else {
          filterBy = `${filterBy},${tag}`;
        }
      });
      filterBy = `${filterBy}]`;
    }
    if (location) {
      if (finalSearchVal == "") {
        finalSearchVal = `${location}`;
      } else {
        finalSearchVal = `${finalSearchVal} ${location}`;
        // filterBy = `${filterBy}&&location:${location}`;
      }
    }

    if (cosignedBy) {
      filterBy = filterBy
        ? `${filterBy}&&cosignedBy:${cosignedBy}`
        : `cosignedBy:${cosignedBy}`;
    }

    let base = `${SEARCH_URL_BASE}/users/documents/search?per_page=25&`;
    let url = `${base}query_by=${queryBy}&q=${finalSearchVal}`;
    if (filterBy) {
      url = `${url}&filter_by=${filterBy}`;
    }

    console.log("url", url);

    return fetch(url, {
      method: "GET",
      headers: getTSHeaders(),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json && json.hits) {
          if (includeAll) {
            let docs = json.hits.map((item) => item.document);
            resolve({ docs: docs, highlights: [] });
          } else {
            let docs = getDocsFromHits(json.hits, finalSearchVal, queryTags);

            resolve({ docs: docs, highlights: [] });
          }
        } else {
          resolve({ docs: [], highlights: [] });
        }
      });
  });
  return promise;
};

const getDocsFromHits = (hits, searchVal, queryTags) => {
  let docs = hits.map((item) => item.document);
  if (queryTags.length == 1) {
    queryTags.forEach((tag) => {
      docs = docs.filter((item) =>
        (item.tags || [])
          .map((item) => `${item}`.toLowerCase().trim())
          .includes(tag.toLowerCase().trim())
      );
    });
  }
  if (queryTags.length > 1) {
    docs = docs.filter((item) => {
      let hasMatch = false;
      (item.tags || []).forEach((tag) => {
        if (
          queryTags
            .map((item) => `${item}`.toLowerCase().trim())
            .includes(tag.toLowerCase().trim())
        ) {
          hasMatch = true;
        }
      });

      return hasMatch;
    });
  }
  return docs;
};

const getTagsFromHits = (hits, searchVal, queryTags) => {
  let docs = hits.map((item) => item.document);
  let tags = [];
  docs.forEach((doc) => {
    (doc.tags || []).forEach((tag) => {
      if (!tags.includes(tag)) {
        if (
          tag.toLowerCase().includes(searchVal.toLowerCase()) ||
          searchVal.toLowerCase().includes(tag.toLowerCase())
        ) {
          tags.push(tag);
        }
      }
    });
  });

  return tags;
};

export const vectorSearch = (vector: string) => {
  let promise = new Promise((resolve, reject) => {
    let url = `https://${TYPESENSE_CLUSTER}:443/multi_search`;

    let queryObj = {
      searches: [
        {
          collection: "userVectors",
          q: "*",
          vector_query: `vec:([${vector}], k:10)`,
        },
      ],
    };

    return fetch(url, {
      method: "POST",
      headers: getTSHeaders(),
      body: JSON.stringify(queryObj),
    })
      .then((response) => response.json())
      .then((json) => {
        resolve(json.results[0].hits.map((item) => item.document));
      });
  });
  return promise;
};

export const createInfoStringFromUser = (user) => {
  let infoString = `${user.username} has ${
    user.xp ? user.xp : 0
  } XP and is ranked #${user.rank}. ${user.username} has ${
    user.followerCount
  } followers. ${
    user.pro
      ? `${
          user.username
        } has the performing rights organization ${user.pro.trim()}. `
      : ""
  }${
    user.publisher
      ? user.publisher == "none"
        ? `${user.username} does not have a publisher. `
        : `${user.username} is published by ${user.publisher.trim()}. `
      : ""
  }${
    user.label
      ? user.label == "none"
        ? `${user.username} is not signed to any label. `
        : `${user.username} is signed to ${user.label.trim()}. `
      : ""
  }${
    user.manager
      ? user.manager == "none"
        ? `${user.username} does not have a manager. `
        : `${user.username} is managed by ${user.manager.trim()}. `
      : ""
  }${user.location ? `${user.username} is in ${user.location.trim()}. ` : ""}${
    user.instruments && user.instruments.length > 0
      ? user.instruments
          .map(
            (item) => `${user.username} plays ${item.trim().toLowerCase()}. `
          )
          .join("")
      : ""
  }${
    user.musicianType && user.musicianType.length > 0
      ? user.musicianType
          .map((item) => `${user.username} is a ${item.trim().toLowerCase()}. `)
          .join("")
      : ""
  }${
    user.studioDetails
      ? `${user.username} records in ${user.studioDetails.trim()}. `
      : ""
  }${user.daw ? `${user.username} works with ${user.daw.trim()}. ` : ""}`;

  if (user.bio) {
    infoString += `About ${user.username}: ${user.bio.trim().toLowerCase()}`;
  }

  return infoString;
};
