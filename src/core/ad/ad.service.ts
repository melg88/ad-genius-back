import { CreateAdDTO } from './dtos/index'
import { OpenaiService } from './../../services/openai/openai.service'
import { Inject, NotFoundException } from '@nestjs/common'
import { AdRepository } from './ad.repository'
import { IdentityRepository } from '@core/identity/identity.repository'

export class AdService {
	constructor(
		@Inject(AdRepository) protected adRepository: AdRepository,
		@Inject(IdentityRepository) protected identityRepository: IdentityRepository,
		@Inject(OpenaiService) protected openaiService: OpenaiService
	) {}

	async createAd(ad: CreateAdDTO) {
		const user = await this.identityRepository.getUserById(ad.userId)

		if (!user) {
			throw new Error('user/get-failed')
		}

		if (user.credits === 0) {
			throw new Error('user/credits-insufficient')
		}

		await this.identityRepository.updateUserCredits(ad.userId, user.credits - 1)

		// const adGenerated = await this.openaiService.generateAnswer(ad)

		return await this.adRepository.createAd(
			ad.userId,
			ad.price,
			'adGenerated.title',
			'adGenerated.description',
			['adGenerated.hashtags']
		)
	}

	async findAdById(adId: string) {
		const ad = await this.adRepository.findOneById(adId)
		if (!ad) {
			throw new NotFoundException('ad/not-found');
		}
		return ad;
	}
}
