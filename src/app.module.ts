import { Module } from '@nestjs/common';
import { IdentityModule } from '@core/identity/identity.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { FirebaseModule } from './services/firebase/firebase.module';
import { OpenaiModule } from './services/openai/openai.module';
import { AdModule } from '@core/ad/ad.module';
import { MetaModule } from './core/meta/meta.module';
import { CloudinaryModule } from './services/cloudinary/cloudinary.module';
import { VideoModule } from './services/video/video.module';
import { TextToSpeechModule } from './services/text-to-speech/text-to-speech.module';
import { StorageModule } from './services/storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] }), IdentityModule, AdModule, PrismaModule, FirebaseModule, StorageModule, OpenaiModule, MetaModule, CloudinaryModule, VideoModule, TextToSpeechModule],
  controllers: [],
  providers: []
})
export class AppModule {}
