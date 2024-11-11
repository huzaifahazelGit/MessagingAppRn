import React, { useEffect, useMemo } from "react";
import { Modal, View } from "react-native";
import { colors } from "../../constants/colors";
import { SearchParams } from "../../screens/search/components/search-bar";
import { BudgetPickerINnerModal } from "../upload-wrappers/budget-picker";
import { LocationPickerInnerModal } from "../upload-wrappers/location-upload";
import { TagsPickerInnerModal } from "../upload-wrappers/tags-picker";
import { TagsList } from "../upload-wrappers/tags-wrapper";
import { UserPickerInnerModal } from "../upload-wrappers/userpicker-button";
import { TagsSearchInnerModal } from "../upload-wrappers/tags-search";

export default function FilterModal({
  onFinish,
  searchParams,
  setSearchParams,
  filteringBy,
  setFilteringBy,
}: {
  onFinish: any;
  searchParams: SearchParams;
  setSearchParams: any;
  filteringBy: "none" | "Role" | "Location" | "Cosign" | "Budget" | "Tags";
  setFilteringBy: any;
}) {
  useEffect(() => {
    if (searchParams.searchKind == "Marketplace") {
      setSearchParams({
        ...searchParams,
        cosignedBy: null,
        role: [],
      });
    } else if (searchParams.searchKind == "Users") {
      setSearchParams({
        ...searchParams,
        budget: 0,
      });
    } else if (searchParams.searchKind == "Posts") {
      setSearchParams({
        ...searchParams,
        cosignedBy: null,
        role: [],
        budget: 0,
      });
    } else if (
      searchParams.searchKind == "Audio" ||
      searchParams.searchKind == "Video" ||
      searchParams.searchKind == "Organizations" ||
      searchParams.searchKind == "Playlists"
    ) {
      setSearchParams({
        ...searchParams,
        cosignedBy: null,
        role: [],
        budget: 0,
      });
    }
  }, [searchParams.searchKind]);

  const searchableItems = useMemo(() => {
    let options = [
      "Audio",
      "Video",
      "Organizations",
      "Playlists",
      "Posts",
      "Users",
      "Marketplace",
      "Role",
      // tara later cosigns
      // "Cosign",
      "Location",
      "Budget",
      "Tags",
    ].filter((item) => item != searchParams.searchKind);
    return options;
  }, [searchParams.searchKind]);

  return (
    <View style={{ width: 350 }}>
      <TagsList
        containerStyles={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
        tagContainerStyles={{
          paddingLeft: 0,
        }}
        backgroundColor={colors.white}
        textColor="black"
        addable={true}
        tags={searchableItems}
        setTags={(newTags) => {}}
        onAdd={(item) => {
          if (
            [
              "Audio",
              "Video",
              "Organizations",
              "Playlists",
              "Posts",
              "Users",
              "Marketplace",
            ].includes(item)
          ) {
            setFilteringBy("none");
            setTimeout(() => {
              onFinish({
                ...searchParams,
                searchKind: item,
              });
            }, 100);
          } else {
            setFilteringBy(item);
          }
        }}
      />

      <Modal visible={filteringBy != "none"}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.black,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            {filteringBy == "Role" && (
              <TagsPickerInnerModal
                options={[
                  "MUSICIAN",
                  "PRODUCER",
                  "ENGINEER",
                  "SONGWRITER",
                  "DJ",
                  "VOCALIST",
                  "MANAGER",
                ]}
                tags={searchParams.role}
                setTags={(tags) => {
                  setSearchParams({
                    ...searchParams,
                    role: tags,
                  });
                }}
                setShowModal={() => setFilteringBy("none")}
                confirm={() => {
                  setFilteringBy("none");

                  setTimeout(() => {
                    onFinish({
                      ...searchParams,
                      searchKind:
                        searchParams.role.length > 0
                          ? "Users"
                          : searchParams.searchKind,
                    });
                  }, 100);
                }}
              />
            )}
            {filteringBy == "Tags" && (
              <TagsSearchInnerModal
                tags={searchParams.tags}
                setTags={(tags) => {
                  setSearchParams({
                    ...searchParams,
                    tags: tags,
                  });
                }}
                setShowModal={() => setFilteringBy("none")}
                confirm={() => {
                  setFilteringBy("none");

                  setTimeout(() => {
                    onFinish({
                      ...searchParams,
                    });
                  }, 100);
                }}
              />
            )}
            {filteringBy == "Location" && (
              <LocationPickerInnerModal
                setShowModal={() => setFilteringBy("none")}
                setLocation={(location) => {
                  setSearchParams({
                    ...searchParams,
                    location: location,
                  });
                }}
                confirmLocation={(val) => {
                  setFilteringBy("none");
                  setTimeout(() => {
                    onFinish({
                      ...searchParams,
                    });
                  }, 100);
                }}
              />
            )}
            {filteringBy == "Cosign" && (
              <UserPickerInnerModal
                setShowModal={() => setFilteringBy("none")}
                confirm={(val) => {
                  setFilteringBy("none");
                  setTimeout(() => {
                    onFinish({
                      ...searchParams,
                    });
                  }, 100);
                }}
                users={searchParams.cosignedBy as any}
                setUsers={(item) => {
                  if (item.length == 0) {
                    setSearchParams({
                      ...searchParams,
                      cosignedBy: null,
                    });
                  } else if (item.length > 0) {
                    setFilteringBy("none");
                    setTimeout(() => {
                      onFinish({
                        ...searchParams,
                        searchKind: "Users",
                        cosignedBy: item[0],
                      });
                    }, 100);
                  }
                }}
              />
            )}
            {filteringBy == "Budget" && (
              <BudgetPickerINnerModal
                setShowModal={() => setFilteringBy("none")}
                budget={searchParams.budget}
                setBudget={(val) => {
                  setSearchParams({
                    ...searchParams,
                    budget: val,
                  });
                }}
                confirm={(val) => {
                  setFilteringBy("none");
                  setTimeout(() => {
                    onFinish({
                      ...searchParams,
                      searchKind: "Marketplace",
                    });
                  }, 100);
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
