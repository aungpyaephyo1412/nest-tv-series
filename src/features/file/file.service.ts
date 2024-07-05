import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { _concatStr } from '../../util';
import {
  FileDeleteParams,
  FileMultipleUploadParams,
  FileSingleUploadParams,
  IFileService,
} from './interfaces/IFileService';

@Injectable()
export class FileService implements IFileService {
  private readonly supabase: SupabaseClient;
  private readonly logger: Logger;
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_ANON_KEY as string,
    );
    this.logger = new Logger('FileService');
  }
  async upload(params: FileSingleUploadParams): Promise<string | null> {
    const fileName = _concatStr([
      Date.now().toString(),
      params.file.originalname,
    ]);
    const { data, error } = await this.supabase.storage
      .from(params.bucket)
      .upload(
        params.path
          ? _concatStr(['/', params.path, '/', fileName], '')
          : _concatStr(['/', fileName], ''),
        params.file.buffer,
      );
    if (error) {
      this.logger.error('Upload', error);
      throw new BadRequestException({
        message: 'Failed to upload file',
        error,
      });
    }
    return data?.path;
  }
  async multiUpload(params: FileMultipleUploadParams) {
    return params.files.map((file) => file.originalname);
  }
  async delete(params: FileDeleteParams) {
    const { error } = await this.supabase.storage
      .from(params.bucket)
      .remove([params.path]);
    if (error) this.logger.error('Delete', error);
  }
}
