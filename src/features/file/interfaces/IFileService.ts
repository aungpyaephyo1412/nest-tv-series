export interface FileSingleUploadParams {
  bucket: string;
  path?: string;
  file: Express.Multer.File;
}
export interface FileMultipleUploadParams {
  bucket: string;
  path?: string;
  files: Express.Multer.File[];
}
export interface FileDeleteParams {
  bucket: string;
  path: string;
}
export interface IFileService {
  upload(params: FileSingleUploadParams): Promise<string | null>;
  multiUpload(params: FileMultipleUploadParams): Promise<string[] | null>;
  delete(params: FileDeleteParams): Promise<void>;
}
