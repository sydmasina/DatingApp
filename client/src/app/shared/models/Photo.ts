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
