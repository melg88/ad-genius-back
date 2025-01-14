import { Inject } from '@nestjs/common'
import { PrismaService } from 'src/services/prisma/prisma.service'

export class AdRepository {
	constructor(@Inject(PrismaService) protected prisma: PrismaService) {}

	async createAd(
		id: string,
		userId: string,
		price: number,
		title: string,
		description: string,
		hashtags: string[]
	) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				id: true,
				credits: true
			}
		})

		if (!user) {
			throw new Error('user/get-failed')
		}

		if (user.credits === 0) {
			throw new Error('user/credits-insufficient')
		}

		await this.prisma.user.update({
			where: {
				id: userId
			},
			data: {
				credits: user.credits - 1
			}
		})

		return await this.prisma.ad.create({
			data: {
				id,
				userId,
				price: price,
				title: title,
				description: description,
				hashtags: hashtags
			}
		})
	}
}
