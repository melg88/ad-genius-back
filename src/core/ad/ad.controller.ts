import {
	Inject,
	Post,
	Get,
	Param,
	Body,
	Controller,
	HttpCode,
	InternalServerErrorException,
	NotFoundException,
	Delete,
	BadRequestException,
	UseInterceptors,
	UploadedFile
} from '@nestjs/common'
import { ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger'
import { AdService } from './ad.service'
import { CreateAdDTO } from './dtos'
import { ApiParam } from '@nestjs/swagger'
import {
	INTERNAL_SERVER_ERROR_API_RESPONSE,
	BAD_REQUEST_API_RESPONSE,
	CREATE_AD_API_RESPONSE,
	FIND_AD_API_RESPONSE,
	GET_USER_API_RESPONSE,
	DELETE_AD_API_RESPONSE,
	SHARE_AD_API_RESPONSE,
	GET_USER_AD_API_RESPONSE
} from '@core/common/docs/constants'
import { Ad } from './entities/ad.entity'
import { FileInterceptor } from '@nestjs/platform-express'
import * as multer from 'multer'

@ApiTags('Ad')
@ApiResponse(INTERNAL_SERVER_ERROR_API_RESPONSE)
@ApiResponse(BAD_REQUEST_API_RESPONSE)
@Controller('ad')
export class AdController {
	constructor(@Inject(AdService) protected adService: AdService) {}

	@Post()
	@HttpCode(201)
	@ApiBody({ type: CreateAdDTO })
	@ApiResponse(CREATE_AD_API_RESPONSE)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: multer.diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
			}),
			fileFilter: (req, file, cb) => {
				if (file.mimetype.startsWith('image/')) {
					cb(null, true)
				} else {
					cb(new BadRequestException('Invalid file type'), false)
				}
			}
		})
	)
	async create(@Body() ad: CreateAdDTO, @UploadedFile() file: Express.Multer.File) {
		try {
			if (!file) {
				throw new BadRequestException('Image file is required')
			}

			return await this.adService.createAd(
				{
					productName: ad.productName,
					targetAudience: ad.targetAudience,
					price: ad.price,
					userId: ad.userId
				},
				file
			)
		} catch (error) {
			console.error('Error creating ad:', error)
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
				throw error
			}
			throw new InternalServerErrorException('ad/find-failed')
		}
	}

	@Get('user/:userId')
	@ApiResponse(GET_USER_AD_API_RESPONSE)
	@ApiParam({ name: 'userId', type: String, description: 'ID do usuário' })
	async getAdsByUserId(@Param('userId') userId: string): Promise<Ad[]> {
		try {
			return await this.adService.findByUserId(userId)
		} catch (error) {
			throw new InternalServerErrorException('ad/get-failed')
		}
	}

	@Delete(':id')
	@HttpCode(204)
	@ApiResponse(DELETE_AD_API_RESPONSE)
	@ApiParam({ name: 'id', type: String, description: 'ID do anúncio' })
	async deleteAd(@Param('id') id: string): Promise<void> {
		try {
			await this.adService.deleteAd(id)
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error
			}
			throw new InternalServerErrorException('ad/delete-failed')
		}
	}

	@Get('status/:id')
	@HttpCode(200)
	@ApiResponse({
		status: 200,
		description: 'Status do vídeo',
		schema: {
			properties: {
				videoUrl: {
					type: 'string',
					description: 'URL do vídeo renderizado'
				}
			}
		}
	})
	@ApiParam({ name: 'id', type: String, description: 'ID do vídeo' })
	async getVideoStatus(@Param('id') renderId: string) {
		try {
			const videoUrl = await this.adService.checkRenderStatus(renderId)
			return videoUrl ? { videoUrl } : { status: 'processing' }
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error
			}
			throw new InternalServerErrorException('ad/status-failed')
		}
	}
}
