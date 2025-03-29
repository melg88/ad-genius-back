import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}