import { SHARE_AD_API_RESPONSE } from '@core/common/docs/constants'
import {
	Controller,
	Get,
	Query,
	Redirect,
	HttpException,
	HttpStatus,
	Body,
	HttpCode,
	InternalServerErrorException,
	Post,
	Inject
} from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Ad } from '@prisma/client'
import { MetaService } from './meta.service'
import { ShareAdDTO } from './dtos'

@ApiTags('Meta')
@Controller('auth/instagram')
export class MetaController {
	private clientId = process.env.INSTAGRAM_CLIENT_ID
	private redirectUri = process.env.INSTAGRAM_REDIRECT_URI

	constructor(@Inject(MetaService) protected metaService: MetaService) {}

	@Post('share-ad')
	@HttpCode(201)
	@ApiBody({ type: ShareAdDTO })
	@ApiResponse(SHARE_AD_API_RESPONSE)
	async shareAd(@Body() ad: ShareAdDTO): Promise<Ad> {
		try {
			return await this.metaService.postToInstagram(
				ad.accessToken,
				ad.accountId,
				ad.adId,
				ad.contacts
			)
		} catch (error) {
			throw new InternalServerErrorException('ad/share-failed')
		}
	}

	@Get()
	@Redirect()
	login() {
		const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=user_profile,user_media&response_type=code`
		return { url: authUrl }
	}

	@Get('callback')
	async getAccessToken(@Query('code') code: string) {
		if (!code) {
			throw new HttpException('Código de autorização ausente', HttpStatus.BAD_REQUEST)
		}

		try {
			const userResponse = await this.metaService.callback(code)

			return {
				accountId: userResponse.data.id,
				username: userResponse.data.username,
				accountType: userResponse.data.account_type,
				accessToken: userResponse.token
			}
		} catch (error) {
			throw new HttpException(
				error.response?.data || 'Erro ao autenticar no Instagram',
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
	}
}
