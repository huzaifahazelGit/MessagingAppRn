import { MaterialIcons } from "@expo/vector-icons";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import FilterModal from "../../../components/modals/filter-modal";
import { TagsList } from "../../../components/upload-wrappers/tags-wrapper";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../constants/fonts";
import { typesenseSearch } from "../../../services/typesense-service";
import { SCREEN_WIDTH } from "../../../constants/utils";
import { BodyText, BoldMonoText } from "../../../components/text";
import Popover from "react-native-popover-view";
import { User } from "../../../models/user";

export interface SearchParams {
  role: string[];
  location: string;
  cosignedBy: { id: string; title: string };
  budget: number;
  searchKind:
    | "Users"
    | "Posts"
    | "Marketplace"
    | "Audio"
    | "Video"
    | "Organizations"
    | "Playlists";
  tags: string[];
  query: string;
}

export const EMPTY_SEARCH_PARAMS: SearchParams = {
  role: [],
  location: "",
  cosignedBy: null,
  budget: 0,
  searchKind: "Users",
  tags: [],
  query: "",
};

export default function SearchBar({
  results,
  setResults,
  setNoResults,
  searchParams,
  setSearchParams,
  setSearching,
}: {
  results: any[];
  setResults: any;
  setNoResults: any;
  setSearching: any;
  searchParams: SearchParams;
  setSearchParams: any;
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const [filteringBy, setFilteringBy] = useState<
    "none" | "Role" | "Location" | "Cosign" | "Budget" | "Tags"
  >("none");

  const budgetString = useMemo(() => {
    if (searchParams.budget > 0) {
      return `$${searchParams.budget > 1 ? "$" : ""}${
        searchParams.budget > 2 ? "$" : ""
      }${searchParams.budget > 3 ? "$" : ""}`;
    }
    return "";
  }, [searchParams]);

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }

  const filterTags = useMemo(() => {
    let items = [
      ...searchParams.tags,
      ...searchParams.role.map((item) => item.toLowerCase()),
    ];

    items.push(searchParams.searchKind.toLowerCase());
    if (searchParams.cosignedBy) {
      items.push(`cosigned by ${searchParams.cosignedBy.title}`);
    }
    if (searchParams.budget > 0) {
      items.push(budgetString);
    }

    if (searchParams.location) {
      items.push(searchParams.location.toLowerCase());
    }

    return items.filter(onlyUnique);
  }, [searchParams, budgetString]);

  const onQuery = (q: SearchParams) => {
    if (q && q.query && q.query.length > 0) {
      searchTS(q);
    } else {
      setResults([]);
    }
  };

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const optimizedFn = useCallback(debounce(onQuery), []);

  useEffect(() => {
    if (
      searchParams.tags.length == 0 &&
      searchParams.query.length == 0 &&
      searchParams.role.length == 0 &&
      searchParams.location.length == 0 &&
      searchParams.cosignedBy == null &&
      searchParams.budget == 0
    ) {
      if (results.length > 0) {
        setResults([]);
      }
    }
  }, [searchParams]);

  const searchTS = async (q: SearchParams) => {
    setNoResults(false);
    let userResults: any = { docs: [], highlights: [] };
    let postResults: any = { docs: [], highlights: [] };
    let companyResults: any = { docs: [], highlights: [] };
    let marketplaceResults: any = { docs: [], highlights: [] };
    let playlistResults: any = { docs: [], highlights: [] };
    if (q.searchKind === "Users") {
      userResults = await typesenseSearch(
        "users",
        q.query,
        [...selectedTags, ...q.tags, ...q.role].filter(
          (item) =>
            item !== q.location.toLowerCase() && !item.includes("cosigned by")
        ),
        q.location,
        q.cosignedBy ? q.cosignedBy.id : null
      );
      companyResults = await typesenseSearch(
        "companies",
        q.query,
        [...selectedTags, ...q.tags, ...q.role].filter(
          (item) =>
            item !== q.location.toLowerCase() && !item.includes("cosigned by")
        ),
        q.location,
        q.cosignedBy ? q.cosignedBy.id : null
      );
    } else if (q.searchKind == "Organizations") {
      companyResults = await typesenseSearch(
        "companies",
        q.query,
        [...selectedTags, ...q.tags, ...q.role].filter(
          (item) =>
            item !== q.location.toLowerCase() && !item.includes("cosigned by")
        ),
        q.location,
        q.cosignedBy ? q.cosignedBy.id : null
      );
    } else if (q.searchKind == "Playlists") {
      console.log("search playlists");
      playlistResults = await typesenseSearch(
        "playlists",
        q.query,
        [...selectedTags, ...q.tags, ...q.role].filter(
          (item) =>
            item !== q.location.toLowerCase() && !item.includes("cosigned by")
        ),
        q.location,
        q.cosignedBy ? q.cosignedBy.id : null
      );
    } else if (q.searchKind === "Posts") {
      postResults = await typesenseSearch(
        "posts",
        q.query,
        [...selectedTags, ...q.tags].filter(
          (item) => item !== q.location.toLowerCase()
        ),
        q.location,
        null,
        null
      );
    } else if (q.searchKind == "Audio") {
      postResults = await typesenseSearch(
        "audio",
        q.query,
        [...selectedTags, ...q.tags].filter(
          (item) => item !== q.location.toLowerCase()
        ),
        q.location,
        null,
        null
      );
    } else if (q.searchKind == "Video") {
      postResults = await typesenseSearch(
        "video",
        q.query,
        [...selectedTags, ...q.tags].filter(
          (item) => item !== q.location.toLowerCase()
        ),
        q.location,
        null,
        null
      );
    } else if (q.searchKind === "Marketplace") {
      marketplaceResults = await typesenseSearch(
        "marketplace",
        q.query,
        [...selectedTags, ...q.tags].filter(
          (item) => item !== q.location.toLowerCase()
        ),
        q.location,
        null,
        q.budget
      );
    }
    setResults([
      ...userResults.docs.map((item) => ({ kind: "user", user: item })),
      ...companyResults.docs.map((item) => ({
        kind: "company",
        company: item,
      })),
      ...playlistResults.docs.map((item) => ({
        kind: "playlist",
        playlist: item,
      })),
      ...postResults.docs.map((item) => ({
        kind: "post",
        post: item,
      })),
      ...marketplaceResults.docs.map((item) => ({
        kind: "marketplace",
        post: item,
      })),
    ]);
    if (
      userResults &&
      postResults &&
      companyResults &&
      playlistResults &&
      marketplaceResults &&
      (userResults.docs.length || []).length == 0 &&
      (companyResults.docs.length || []).length == 0 &&
      (playlistResults.docs.length || []).length == 0 &&
      (postResults.docs.length || []) == 0 &&
      (marketplaceResults.docs.length || []) == 0
    ) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  };

  return (
    <View style={{}}>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            setSearching(false);
            setResults([]);
            setSearchParams(EMPTY_SEARCH_PARAMS);
          }}
          style={{ marginTop: 6, marginLeft: 20, marginRight: 6 }}
        >
          <MaterialIcons name="close" size={24} color={colors.blue} />
        </TouchableOpacity>
        <View
          style={{
            marginRight: 20,
            marginBottom: 5,
            borderBottomColor: colors.transparentWhite7,
            borderBottomWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            width: SCREEN_WIDTH - 70,
          }}
        >
          <TextInput
            style={{
              fontFamily: Fonts.MonoBold,
              flex: 1,
              textAlign: "left",
              color: "white",
              paddingVertical: 12,
              paddingHorizontal: 8,
              fontSize: 16,
            }}
            multiline={false}
            autoCapitalize={"none"}
            placeholderTextColor={colors.transparentWhite4}
            placeholder={`Search by name, location or keyword `}
            value={searchParams.query}
            onChangeText={(val) => {
              setNoResults(false);
              setSearchParams({
                ...searchParams,
                query: val,
              });
              optimizedFn({
                ...searchParams,
                query: val,
              });
            }}
            autoFocus={true}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <View style={{ marginTop: 4 }}>
          <View
            style={{
              width: SCREEN_WIDTH - 130,
            }}
          >
            <TagsList
              border={true}
              backgroundColor={colors.transparentWhite6}
              textColor="white"
              tags={filterTags}
              setTags={(newTags) => {
                setResults([]);
                setSelectedTags(
                  newTags.filter((item) => !filterTags.includes(item))
                );

                setSearchParams({
                  ...searchParams,
                  role: searchParams.role.filter((item) =>
                    newTags.includes(item)
                  ),
                  budget:
                    budgetString.length > 0 && !newTags.includes(budgetString)
                      ? 0
                      : searchParams.budget,
                  location:
                    searchParams.location &&
                    searchParams.location.length > 0 &&
                    !newTags.includes(searchParams.location)
                      ? ""
                      : searchParams.location,
                  cosignedBy:
                    searchParams.cosignedBy &&
                    !newTags.includes(searchParams.cosignedBy.title)
                      ? null
                      : searchParams.cosignedBy,
                });

                if (!newTags.includes(searchParams.searchKind)) {
                  setShowModal(true);
                }
              }}
            />
          </View>
        </View>

        <Popover
          isVisible={showModal}
          onRequestClose={() => setShowModal(false)}
          popoverStyle={{ backgroundColor: "transparent" }}
          from={
            <TouchableOpacity
              onPress={() => {
                setShowModal(true);
              }}
              style={{ paddingVertical: 6, paddingRight: 2, marginTop: -2 }}
            >
              <BoldMonoText>Filter by...</BoldMonoText>
            </TouchableOpacity>
          }
        >
          <View style={{}}>
            <FilterModal
              onFinish={(params) => {
                setResults([]);
                setShowModal(false);
                setSearchParams(params);
                searchTS(params);
              }}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              filteringBy={filteringBy}
              setFilteringBy={setFilteringBy}
            />
          </View>
        </Popover>
      </View>
    </View>
  );
}
