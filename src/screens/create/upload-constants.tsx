export enum UploadKinds {
  Audio = "Audio",
  Video = "Video",
  Image = "Image",
  ImageRecording = "ImageRecording",
  Microphone = "Microphone",
  Links = "Links",
  Skip = "Skip",
}

export const ALL_UPLOAD_KINDS = [
  UploadKinds.Audio,
  UploadKinds.Video,
  UploadKinds.Image,
  UploadKinds.ImageRecording,
  UploadKinds.Microphone,
  UploadKinds.Links,
  UploadKinds.Skip,
];

export interface TempAudioObject {
  mimeType: string;
  name: string;
  size: number;
  type: string;
  uri: string;
  downloadable: boolean;
  profileDisplay: boolean;
}

export interface TempLinksObject {
  youtubeId: string;
  spotifyId: string;
  soundcloudLink: string;

  image?: string;
  title?: string;
  artist?: string;
  duration?: number;
}

export const EMPTY_LINKS_OBJ = {
  youtubeId: "",
  spotifyId: "",
  soundcloudLink: "",
  image: null,
  title: null,
  artist: null,
  duration: null,
};

export interface UploadSelectionObject {
  audioObject: TempAudioObject | null;
  videoURL: string;
  imageURL: string;
  linksObject: TempLinksObject;
}

export const EMPTY_UPLOAD_SELECTION_OBJECT = {
  audioObject: null,
  videoURL: "",
  imageURL: "",
  linksObject: EMPTY_LINKS_OBJ,
};
