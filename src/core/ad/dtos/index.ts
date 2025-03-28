import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsString, IsNumber } from 'class-validator'

export class CreateAdDTO {
	@ApiProperty({ description: 'The userId' })
	@IsString({ message: 'userId must be a string' })
	userId: string

	@ApiProperty({ description: 'The price' })
    @Transform(({ value }) => {
        const convertedValue = parseFloat(value)
        if (isNaN(convertedValue)) {
            throw new Error('price must be a valid number')
        }
        return convertedValue
    })
    @IsNumber({}, { message: 'price must be a number' })
    price: number
	
	@ApiProperty({ description: 'The product name' })
	@IsString({ message: 'productName must be a string' })
	productName: string

	@ApiProperty({ description: 'The target audience' })
	@IsString({ message: 'targetAudience must be a string' })
	targetAudience: string
}