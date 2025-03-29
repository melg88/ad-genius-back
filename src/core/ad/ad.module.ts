import { Module } from '@nestjs/common'
import { AdController } from './ad.controller'
import { AdRepository } from './ad.repository'
import { AdService } from './ad.service'
import { OpenaiModule } from 'src/services/openai/openai.module'
import { IdentityRepository } from '@core/identity/identity.repository'
import { CloudinaryModule } from 'src/services/cloudinary/cloudinary.module'
import { VideoModule } from 'src/services/video/video.module'
import { StorageModule } from 'src/services/storage/storage.module'
import { TextToSpeechModule } from 'src/services/text-to-speech/text-to-speech.module'

@Module({
	imports: [ OpenaiModule, CloudinaryModule, VideoModule, StorageModule, TextToSpeechModule ],
	controllers: [AdController],
	providers: [AdService, AdRepository, IdentityRepository],
	exports: [AdService]
})
export class AdModule {}
