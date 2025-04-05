import { createReadStream } from 'fs'
import { BlobServiceClient } from '@azure/storage-blob'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppConfig } from 'src/config'

@Injectable()
export class StorageService {
	constructor(@Inject(ConfigService) private configService: ConfigService<AppConfig>) {}

	async uploadAudio(localPath: string, id: string) {
		
		const containerClient = this.getContainerClient()

		const blockBlobClient = containerClient.getBlockBlobClient(`${id}`)
		const readStream = createReadStream(localPath)
		const blockSize = 4 * 1024 * 1024

		await blockBlobClient.uploadStream(readStream, blockSize, 5, {
			blobHTTPHeaders: { blobContentType: 'audio/mpeg' }
		})

		return { outputPath: blockBlobClient.url }
	}

	async uploadImageFromBuffer(buffer: Buffer, id: string) {
		
		const containerClient = this.getContainerClient()

		const blockBlobClient = containerClient.getBlockBlobClient(`${id}`)

		await blockBlobClient.upload(buffer, buffer.length, {
			blobHTTPHeaders: { blobContentType: 'image/jpeg' }
		})

		return blockBlobClient.url
	}

	private getContainerClient() {
		const storageConfig = this.configService.get<AppConfig['storage']>('storage')
		const blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.azure.connectionString)
		return blobServiceClient.getContainerClient(storageConfig.azure.containerName)
	  }
	  
}
