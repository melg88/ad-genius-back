import { IUser, Tier } from '@core/identity/entities'
import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/services/prisma/prisma.service'

@Injectable()
export class IdentityRepository {
	constructor(@Inject(PrismaService) protected prisma: PrismaService) {}

	async createUser(user: IUser) {
		return await this.prisma.user.create({
			data: {
				id: user.id,
				email: user.email,
				phone: user.phone,
				name: user.name,
				cpf: user.cpf,
			}
		})
	}

	async getUserByEmail(email: string) {
		return await this.prisma.user.findUnique({
			where: {
				email
			},
			select: {
				id: true,
				email: true,
				phone: true,
				name: true,
				cpf: true,
				credits: true,
				tier: true,
				createdAt: true,
				updatedAt: true
			}
		})
	}

	async getUserById(id: string) {
		return await this.prisma.user.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				email: true,
				phone: true,
				name: true,
				cpf: true,
				credits: true,
				tier: true,
				createdAt: true,
				updatedAt: true
			}
		})
	}

	async updateUserTier(id: string, tier: Tier) {
		return await this.prisma.user.update({
			where: {
				id
			},
			data: {
				tier: tier
			}
		})
	}

	async updateUserCredits(id: string, credits: number) {
		return await this.prisma.user.update({
			where: {
				id
			},
			data: {
				credits: credits
			}
		})
	}

	async deleteUser(id: string) {
		return await this.prisma.user.delete({
			where: {
				id
			}
		})
	}

	async addMonthlyBonus() {
		const monthlyBonus = 10
		return this.prisma.$transaction(async () => {
			await this.prisma.user.updateMany({
				where: {
					tier: Tier.FREE
				},
				data: {
					credits: {
						increment: monthlyBonus
					}
				}
			})
			await this.prisma.user.updateMany({
				where: {
					tier: Tier.BASIC
				},
				data: {
					credits: {
						increment: monthlyBonus * 10
					}
				}
			})
			await this.prisma.user.updateMany({
				where: {
					tier: Tier.PREMIUM
				},
				data: {
					credits: {
						increment: monthlyBonus * 100
					}
				}
			})
		})
	}
}
