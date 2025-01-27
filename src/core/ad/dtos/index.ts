import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'

export class CreateAdDTO {
	@ApiProperty({ description: 'The userId' })
	@IsString({ message: 'userId must be a string' })
	userId: string

	@ApiProperty({ description: 'The price' })
	@IsNumber({}, { message: 'price must be a number' })
	price: number

	@ApiProperty({ description: 'The title' })
	@IsString({ message: 'title must be a string' })
	title: string

	@ApiProperty({ description: 'The description' })
	@IsString({ message: 'description must be a string' })
	description: string
}
