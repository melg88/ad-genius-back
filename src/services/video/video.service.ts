import { Injectable, HttpException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { videoTemplate } from './video-template'

@Injectable()
export class VideoService {
	private readonly API_URL = 'https://api.shotstack.io/edit/stage/render'
	private readonly API_KEY = process.env.SHOTSTACK_API_KEY

	constructor(private readonly httpService: HttpService) {}

	async createVideo(
		imageUrl: string,
		audioUrl: string,
		title: string,
		price: string
	): Promise<string> {
		const requestBody = videoTemplate(
			imageUrl,
			audioUrl,
			title,
			price
		)

		try {
			const response = await lastValueFrom(
				this.httpService.post(this.API_URL, requestBody, {
					headers: {
						'Content-Type': 'application/json',
						'x-api-key': this.API_KEY
					}
				})
			)

			return response.data.response.id
		} catch (error) {
			throw new HttpException(
				error.response?.data || 'Error creating video',
				error.response?.status || 500
			)
		}
	}

	async checkRenderStatus(renderId: string): Promise<string | null> {
		const url = `${this.API_URL}/${renderId}`

		try {
			const response = await lastValueFrom(
				this.httpService.get(url, {
					headers: {
						'Content-Type': 'application/json',
						'x-api-key': this.API_KEY
					}
				})
			)
			const { status, url: videoUrl } = response.data.response
			if (status === 'done') {
				return videoUrl
			} else if (status === 'failed') {
				throw new HttpException('Render failed', 400)
			}
			return null
		} catch (error) {
			throw new HttpException(
				error.response?.data || 'Error checking status',
				error.response?.status || 500
			)
		}
	}
}
