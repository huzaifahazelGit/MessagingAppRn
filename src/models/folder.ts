export interface Folder {
  id?: string;
  userId: string;

  createdate: any;
  lastupdate: any;

  // image data
  image?: string;
  name: string;

  tags: string[];

  archived: boolean;

  parentFolderId?: string;
  fileCount: number;
  starred?: boolean;
}
