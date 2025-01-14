import { IdentityService } from '@core/identity/identity.service'
import {
	Inject,
	Post,
	Body,
	Controller,
	HttpCode,
	InternalServerErrorException,
	Param
} from '@nestjs/common'
import { ApiResponse, ApiBody } from '@nestjs/swagger'
import { AdService } from './ad.service'
import { CreateAdDTO } from './dtos'
import {
	INTERNAL_SERVER_ERROR_API_RESPONSE,
	BAD_REQUEST_API_RESPONSE,
	CREATE_AD_API_RESPONSE
} from '@core/common/docs/constants'
import { Ad } from './entities/ad.entity'

@ApiResponse(INTERNAL_SERVER_ERROR_API_RESPONSE)
@ApiResponse(BAD_REQUEST_API_RESPONSE)
@Controller('identity')
export class AdController {
	constructor(
		@Inject(AdService) protected adService: AdService,
		@Inject(IdentityService) protected identityService: IdentityService
	) {}

	@Post('create-ad/:id')
	@HttpCode(201)
	@ApiBody({ type: CreateAdDTO })
	@ApiResponse(CREATE_AD_API_RESPONSE)
	async create(@Param('id') id: string, @Body() ad: CreateAdDTO): Promise<Ad> {
		try {
			return await this.adService.createAd(id, ad)
		} catch (error) {
			throw new InternalServerErrorException('ad/create-failed')
		}
	}
}
