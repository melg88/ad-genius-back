import { OpenaiService } from './../../services/openai/openai.service'
import { Inject } from '@nestjs/common'
import { AdRepository } from './ad.repository'
import { IdentityRepository } from '@core/identity/identity.repository'

export class AdService {
	constructor(
		@Inject(AdRepository) protected adRepository: AdRepository,
		@Inject(IdentityRepository) protected identityRepository: IdentityRepository,
		@Inject(OpenaiService) protected openaiService: OpenaiService
	) {}

	async createAd(id: string, userId: string, price: number) {
		// const adGenerated = await this.openaiService.generateAnswer()

		return await this.adRepository.createAd(
			id,
			userId,
			price,
			'adGenerated.title',
			'adGenerated.description',
			['adGenerated.hashtags']
		)
	}
}
