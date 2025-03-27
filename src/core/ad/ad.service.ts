import { CreateAdDTO } from './dtos/index'
import { OpenaiService } from './../../services/openai/openai.service'
import { Inject, NotFoundException } from '@nestjs/common'
import { AdRepository } from './ad.repository'
import { IdentityRepository } from '@core/identity/identity.repository'
import { Ad } from './entities/ad.entity'

export class AdService {
	constructor(
		@Inject(AdRepository) protected adRepository: AdRepository,
		@Inject(IdentityRepository) protected identityRepository: IdentityRepository,
		@Inject(OpenaiService) protected openaiService: OpenaiService
	) {}

	async createAd(ad: CreateAdDTO, filePath: string) {
		const user = await this.identityRepository.getUserById(ad.userId)

		if (!user) {
			throw new Error('user/get-failed')
		}

		if (user.credits === 0) {
			throw new Error('user/credits-insufficient')
		}

		await this.identityRepository.updateUserCredits(ad.userId, user.credits - 1)

		const imageUrl = `https://yourdomain.com/${filePath}`

		const adGenerated = await this.openaiService.generateAdContent(ad.productName, ad.targetAudience, imageUrl)

		return await this.adRepository.createAd(
			ad.userId,
			ad.price,
			adGenerated.title,
			imageUrl,
			adGenerated.description,
			adGenerated.hashtags
		)
	}

	async findAdById(adId: string) {
		const ad = await this.adRepository.findOneById(adId)
		if (!ad) {
			throw new NotFoundException('ad/not-found');
		}
		return ad;
	}

	async findByUserId(userId: string): Promise<Ad[]> {
		try {
			return await this.adRepository.findByUserId(userId);  
		} catch (error) {
			throw new Error('Error fetching ads by user');  
		}
	}

	async deleteAd(id: string): Promise<void> {
		try {
			const ad = await this.adRepository.findOneById(id);
			if (!ad) {
				throw new NotFoundException('ad/not-found');
			}
			await this.adRepository.deleteAd(id);
		} catch (error) {
			if(error instanceof NotFoundException) {
                throw error;
            }
            throw new Error('ad/delete-failed')
		}
	}
	
}
