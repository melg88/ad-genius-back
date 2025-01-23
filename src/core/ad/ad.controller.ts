import {
	Inject,
	Post,
	Get,
	Param,
	Body,
	Controller,
	HttpCode,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { ApiResponse, ApiBody } from '@nestjs/swagger'
import { AdService } from './ad.service'
import { CreateAdDTO } from './dtos'
import {
	INTERNAL_SERVER_ERROR_API_RESPONSE,
	BAD_REQUEST_API_RESPONSE,
	CREATE_AD_API_RESPONSE,
	FIND_AD_API_RESPONSE
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

	@Get(':id')
	@HttpCode(200)
	@ApiResponse(FIND_AD_API_RESPONSE)
	async getAdById(@Param('id') id: string): Promise<Ad> {
		try {
			return await this.adService.findAdById(id)
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new InternalServerErrorException('ad/find-failed')
		}
	}
}
