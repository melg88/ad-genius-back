import {
	Inject,
	Post,
	Body,
	Controller,
	HttpCode,
	InternalServerErrorException
} from '@nestjs/common'
import { ApiResponse, ApiBody } from '@nestjs/swagger'
import { AdService } from './ad.service'
import { CreateAdDTO } from './dtos'
import { Get, Param } from '@nestjs/common'
import { ApiParam } from '@nestjs/swagger'
import {
	INTERNAL_SERVER_ERROR_API_RESPONSE,
	BAD_REQUEST_API_RESPONSE,
	CREATE_AD_API_RESPONSE,
	GET_USER_API_RESPONSE
} from '@core/common/docs/constants'
import { Ad } from './entities/ad.entity'

@ApiResponse(INTERNAL_SERVER_ERROR_API_RESPONSE)
@ApiResponse(BAD_REQUEST_API_RESPONSE)
@Controller('ad')
export class AdController {
	constructor(@Inject(AdService) protected adService: AdService) {}

	@Post()
	@HttpCode(201)
	@ApiBody({ type: CreateAdDTO })
	@ApiResponse(CREATE_AD_API_RESPONSE)
	async create(@Body() ad: CreateAdDTO): Promise<Ad> {
		try {
			return await this.adService.createAd(ad)
		} catch (error) {
			throw new InternalServerErrorException('ad/create-failed')
		}
	}

	@Get(':userId')
	@ApiResponse(GET_USER_API_RESPONSE)
	@ApiParam({ name: 'userId', type: String, description: 'ID do usuário' })
	async getAdsByUserId(@Param('userId') userId: string): Promise<Ad[]> {
		try {
			return await this.adService.findByUserId(userId)
		} catch (error) {
			throw new InternalServerErrorException('ad/get-failed')
		}
	}
}

