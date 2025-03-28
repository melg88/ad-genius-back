import { Inject } from '@nestjs/common'
import { PrismaService } from 'src/services/prisma/prisma.service'

export class AdRepository {
	constructor(@Inject(PrismaService) protected prisma: PrismaService) {}

	async createAd(
		userId: string,
		price: number,
		title: string,
		imageUrl: string,
		description: string,
		hashtags: string[]
	) {
		return await this.prisma.ad.create({
			data: {
				userId,
				price: price,
				title: title,
				imageUrl: imageUrl,
				description: description,
				hashtags: hashtags
			}
		})
	}

	async findOneById(adId: string) {
		return await this.prisma.ad.findUnique({
			where: { 
				id: adId 
			},
			select: {
				id: true,
				title: true,
				description: true,
				price: true,
				hashtags: true,
				imageUrl: true,
				userId: true,
			}
		})
	}
	
	async findByUserId(userId: string) {
		return await this.prisma.ad.findMany({
			where: { userId }  

		})
	}

	async deleteAd(id: string): Promise<void> {
		await this.prisma.ad.delete({
			where: { id }
		});
	}
}
