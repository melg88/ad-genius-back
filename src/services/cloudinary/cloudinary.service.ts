import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class CloudinaryService {
	constructor() {
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET
		})
	}

	async uploadImage(filePath: string, options?: Record<string, any>) {
		try {
			const uploadResult = await cloudinary.uploader.upload(filePath, {
				public_id: options?.public_id,
				...options
			})
			return uploadResult
		} catch (error) {
			throw new Error(`Cloudinary upload failed: ${error.message}`)
		}
	}

	async uploadImageFromBuffer(fileBuffer: Buffer, options?: Record<string, any>) {
		try {
			const result = await new Promise<any>((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					options,
					(error, result) => {
						if (error) reject(error)
						resolve(result)
					}
				)
				uploadStream.end(fileBuffer)
			})

			return cloudinary.url(result.public_id, {
				fetch_format: 'auto',
				quality: 'auto',
				secure: true,
				...options
			})
		} catch (error) {
			throw new Error(`Cloudinary upload failed: ${error.message}`)
		}
	}

	getOptimizedUrl(publicId: string, options: Record<string, any> = {}) {
		return cloudinary.url(publicId, {
			fetch_format: 'auto',
			quality: 'auto',
			...options
		})
	}

	getTransformedUrl(publicId: string, transformationOptions: Record<string, any> = {}) {
		return cloudinary.url(publicId, {
			crop: 'auto',
			gravity: 'auto',
			width: 500,
			height: 500,
			...transformationOptions
		})
	}

	async deleteImage(publicId: string) {
		try {
			const result = await cloudinary.uploader.destroy(publicId)
			return result
		} catch (error) {
			throw new Error(`Cloudinary delete failed: ${error.message}`)
		}
	}
}
