export interface Photo {
  id: number;
  url: string;
  isMain: boolean;
  publicId: string;
}

export interface PhotoToDelete {
  DbId: number;
  PublicId: string | null;
}

export interface PhotoToUpload {
  photoFile: File;
  isMain: boolean;
}
