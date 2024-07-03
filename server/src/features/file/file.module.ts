import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.register(), // Configure file storage location
  ],
  controllers: [],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
