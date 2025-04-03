import { Injectable, Inject } from '@nestjs/common'
import { Tier, User } from './entities'
import { IdentityRepository } from './identity.repository'
import { FirebaseService } from 'src/services/firebase/firebase.service'

@Injectable()
export class IdentityService {
	constructor(
		@Inject(IdentityRepository) protected identityRepository: IdentityRepository,
		@Inject(FirebaseService) protected firebaseService: FirebaseService
	) {}

	async register(params: { email: string; password: string; name: string; cpf: string; phone: string }) {
		const account = await this.firebaseService.createUser(params)
		const user = new User({
			id: account.uid,
			email: params.email,
			phone: params.phone,
			name: params.name,
			cpf: params.cpf,
			tier: Tier.FREE,
			credits: 10,
		})
		await this.identityRepository.createUser(user)
	}

	async createAccountByLoginWithGoogle(email: string) {
		const user = await this.identityRepository.getUserByEmail(email)
		if (!user) {
			const accountInfo = await this.firebaseService.getUserByEmail(email)
			await this.identityRepository.createUser(user)
		}
	}

	async getUserByEmail(email: string) {
		return await this.identityRepository.getUserByEmail(email)
	}

	async getUserById(id: string) {
		return await this.identityRepository.getUserById(id)
	}

	async updateTier(userId: string, tier: Tier) {
		await this.identityRepository.updateUserTier(userId, tier)
	}

	async updateCredits(userId: string, credits: number) {
		await this.identityRepository.updateUserCredits(userId, credits)
	}

	async deleteUser(userId: string) {
		await this.firebaseService.deleteUser(userId)
		await this.identityRepository.deleteUser(userId)
	}

	async addMonthlyBonus() {
		return await this.identityRepository.addMonthlyBonus()
	}
}
