import { Module } from '@nestjs/common'
import { AdController } from './ad.controller'
import { AdRepository } from './ad.repository'
import { AdService } from './ad.service'
import { OpenaiModule } from 'src/services/openai/openai.module'

@Module({
	imports: [ OpenaiModule ],
	controllers: [AdController],
	providers: [AdService, AdRepository],
	exports: [AdService]
})
export class AdModule {}
