import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'

export class CreateAdDTO {
	@ApiProperty({ description: 'The userId' })
	@IsString({ message: 'userId must be a string' })
	userId: string

	@ApiProperty({ description: 'The price' })
	@IsNumber({}, { message: 'price must be a number' })
	price: number
}
