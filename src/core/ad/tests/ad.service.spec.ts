import { Test, TestingModule } from '@nestjs/testing'
import { AdService } from '../ad.service'
import { AdRepository } from '../ad.repository'
import { IdentityRepository } from '@core/identity/identity.repository'
import { OpenaiService } from 'src/services/openai/openai.service'
import { PrismaService } from 'src/services/prisma/prisma.service'
import { NotFoundException } from '@nestjs/common'

describe('AdService', () => {
	let adService: AdService
	let adRepository: AdRepository

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AdService,
				AdRepository,
				PrismaService,
				IdentityRepository,
				{
					provide: OpenaiService,
					useValue: {
						// mock de métodos do OpenAI
					}
				}
			]
		}).compile()

		adService = module.get<AdService>(AdService)
		adRepository = module.get<AdRepository>(AdRepository)
	})

	it('should return a valid ad when the ID is found', async () => {
		const mockAd = {
			id: '123',
			title: 'Sample Ad',
			description: 'Description',
			price: 100,
			hashtags: ['example'],
			imagesUrls: ['https://example.com/image.png'],
			userId: 'user123'
		}

		jest.spyOn(adRepository, 'findOneById').mockResolvedValue(mockAd)

		const result = await adService.findAdById('123')
		expect(result).toEqual(mockAd)
	})

	it('should throw NotFoundException when ID is not found', async () => {
		jest.spyOn(adRepository, 'findOneById').mockResolvedValue(null)

		await expect(adService.findAdById('123')).rejects.toThrow(NotFoundException)
	})
})
