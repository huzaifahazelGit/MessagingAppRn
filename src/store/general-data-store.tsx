import { Store } from "pullstate";
import { Follow } from "../models/follow";
import { Collaboration } from "../models/collaboration";
import { Playlist } from "../models/playlist";
import { Company } from "../models/company";

interface GeneralState {
  xpMax: number;
  inviteMax: number;
  postMax: number;
  submissionMax: number;
  winMax: number;
  playlists: Playlist[];
  companies: Company[];
}

export const GeneralDataStore = new Store<GeneralState>({
  playlists: [],
  companies: [],
  xpMax: 2000,
  inviteMax: 100,
  postMax: 1000,
  submissionMax: 100,
  winMax: 100,
});

export function removePlaylist(playlist: Playlist) {
  GeneralDataStore.update((s) => {
    s.playlists = s.playlists.filter((item) => item.id != playlist.id);
  });
}

export function setPlaylist(playlist: Playlist) {
  GeneralDataStore.update((s) => {
    s.playlists = [
      ...s.playlists.filter((item) => item.id != playlist.id),
      playlist,
    ];
  });
}

export function setAllPlaylists(playlists: Playlist[]) {
  GeneralDataStore.update((s) => {
    s.playlists = playlists;
  });
}

export function removeCompany(company: Company) {
  GeneralDataStore.update((s) => {
    s.companies = s.companies.filter((item) => item.id != company.id);
  });
}

export function setCompany(company: Company) {
  GeneralDataStore.update((s) => {
    s.companies = [
      ...s.companies.filter((item) => item.id != company.id),
      company,
    ];
  });
}

export function setAllCompanies(companies: Company[]) {
  GeneralDataStore.update((s) => {
    s.companies = companies;
  });
}

export function updateAllXp(xp: {
  inviteMax: number;
  postMax: number;
  submissionMax: number;
  winMax: number;
  xpMax: number;
}) {
  GeneralDataStore.update((s) => {
    s.xpMax = xp.xpMax;
    s.inviteMax = xp.inviteMax;
    s.postMax = xp.postMax;
    s.submissionMax = xp.submissionMax;
    s.winMax = xp.winMax;
  });
}
