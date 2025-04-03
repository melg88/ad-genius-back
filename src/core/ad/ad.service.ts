import { CreateAdDTO } from './dtos/index'
import { OpenaiService } from './../../services/openai/openai.service'
import { Inject, NotFoundException } from '@nestjs/common'
import { AdRepository } from './ad.repository'
import { IdentityRepository } from '@core/identity/identity.repository'
import { Ad, CreateAdParams } from './entities/ad.entity'
import { CloudinaryService } from 'src/services/cloudinary/cloudinary.service'
import * as fs from 'fs'
import { VideoService } from 'src/services/video/video.service'
import { StorageService } from 'src/services/storage/storage.service'

export class AdService {
	constructor(
		@Inject(AdRepository) private adRepository: AdRepository,
		@Inject(IdentityRepository) private identityRepository: IdentityRepository,
		@Inject(OpenaiService) private openaiService: OpenaiService,
		@Inject(VideoService) private videoService: VideoService,
		@Inject(StorageService) private readonly storageService: StorageService,
	) {}

	async createAd(ad: CreateAdParams, file: Express.Multer.File ) {
		const user = await this.identityRepository.getUserById(ad.userId)

		if (!user) {
			throw new Error('user/get-failed')
		}

		if (user.credits === 0) {
			throw new Error('user/credits-insufficient')
		}

		await this.identityRepository.updateUserCredits(ad.userId, user.credits - 1)

		const fileBuffer = await fs.promises.readFile(file.path);
		
		const imageUrl = await this.storageService.uploadImageFromBuffer(fileBuffer, `image-${ad.userId}-${Date.now()}`)

		const adGenerated = await this.openaiService.generateAdContent(ad.productName, ad.targetAudience, imageUrl)
		const audioPath = await this.openaiService.generateAudio(adGenerated.caption, `${ad.userId}-${Date.now()}`)

		const audioAzurePath = await this.storageService.uploadAudio(audioPath, `${adGenerated.title}-${ad.userId}-${Date.now()}`)
		
		const videoId = await this.videoService.createVideo(imageUrl, audioAzurePath.outputPath, adGenerated.title, `R$ ${ad.price}`)

		return await this.adRepository.createAd(
			ad.userId,
			ad.price,
			adGenerated.title,
			imageUrl,
			adGenerated.description,
			adGenerated.hashtags,
			adGenerated.caption,
			videoId,
			audioAzurePath.outputPath,
		)
	}

	async checkRenderStatus(videoId: string): Promise<string> {
		return await this.videoService.checkRenderStatus(videoId)
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
