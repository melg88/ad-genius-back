import { Global, Module } from '@nestjs/common'
import { MetaService } from './meta.service'
import { MetaController } from './meta.controller'
import { AdRepository } from '@core/ad/ad.repository'

@Module({
	providers: [MetaService, AdRepository],
	exports: [MetaService],
	controllers: [MetaController]
})
export class MetaModule {}
