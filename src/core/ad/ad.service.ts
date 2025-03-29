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
import { TextToSpeechService } from 'src/services/text-to-speech/text-to-speech.service'

export class AdService {
	constructor(
		@Inject(AdRepository) private adRepository: AdRepository,
		@Inject(IdentityRepository) private identityRepository: IdentityRepository,
		@Inject(OpenaiService) private openaiService: OpenaiService,
		@Inject(CloudinaryService) private cloudinaryService: CloudinaryService,
		@Inject(VideoService) private videoService: VideoService,
		@Inject(StorageService) private readonly storageService: StorageService,
		@Inject(TextToSpeechService) private readonly textToSpeechService: TextToSpeechService,
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

		/*const fileBuffer = await fs.promises.readFile(file.path);
		const imageUrl = await this.cloudinaryService.uploadImageFromBuffer(fileBuffer, {
			public_id: `ads/${ad.userId}/${Date.now()}`
		})*/
		const imageUrl = "https://res.cloudinary.com/dfqsxzm4t/image/upload/f_auto,q_auto/v1/ads/Xkj7VdVUwvUtu2x2gqyQt6fPMau2/1743166078799?_a=BAMAJaXw0"

		//const adGenerated = await this.openaiService.generateAdContent(ad.productName, ad.targetAudience, imageUrl)
		const adGenerated ={
			title: "Conectado e estiloso com o Galaxy S23 Ultra",
			description: "Compre agora e aproveite a tecnologia de ponta!",
			hashtags: ["#GalaxyS23", "#Tecnologia","#Estilo"],
			caption: "Chegou a hora de elevar seu jogo com o Galaxy S23 Ultra! Com uma super câmera traseira para capturas incríveis, tela gigante para seus games e vídeos e uma bateria que dura o dia todo, esse smartphone foi feito para quem vive online. Ideal para os rolês com amigos, registrar cada momento e nunca ficar por fora das trends. E não é só isso, sua tecnologia de ponta garante que tudo flui rápido, seja navegando pelas redes ou em batalhas nos jogos 🔥. #FiqueNaModa #Conectado #GalaxyS23Ultra, o seu próximo nível de interação!",
		}

		//const audioPath = await this.textToSpeechService.generateAudio(adGenerated.caption, `${adGenerated.title}-${ad.userId}-${Date.now()}`)
	
		//const audioAzurePath = await this.storageService.uploadAudio(audioPath, `${adGenerated.title}-${ad.userId}-${Date.now()}`)
		const audioAzurePath = { outputPath: "https://adgenius.blob.core.windows.net/audios/Conectado%20e%20estiloso%20com%20o%20Galaxy%20S23%20Ultra%20%F0%9F%93%B1%E2%9C%A8-Xkj7VdVUwvUtu2x2gqyQt6fPMau2-1743252813468?sp=r&st=2025-03-29T13:00:04Z&se=2025-03-29T21:00:04Z&spr=https&sv=2024-11-04&sr=b&sig=tTewtD57QMwkPsuGbUzzFLkkMRPARYoTdszkK%2BXcES8%3D" }

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
