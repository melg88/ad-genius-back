import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'

export class CreateAdDTO {
	@ApiProperty({ description: 'The userId' })
	@IsString({ message: 'userId must be a string' })
	userId: string

	@ApiProperty({ description: 'The price' })
	@IsNumber({}, { message: 'price must be a number' })
	price: number

	@ApiProperty({ description: 'The product name' })
	@IsString({ message: 'productName must be a string' })
	productName: string

	@ApiProperty({ description: 'Key features' })
	@IsString({ message: 'keyFeatures must be a string' })
	keyFeatures: string

	@ApiProperty({ description: 'The target audience' })
	@IsString({ message: 'targetAudience must be a string' })
	targetAudience: string
}