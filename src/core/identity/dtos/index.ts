import { IsEmail, IsIn, IsInt, IsString, Length } from 'class-validator'
import { Tier } from '../entities'
import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
	@ApiProperty({ description: 'The email' })
	@Length(5, 50, { message: 'email must be between 5 and 50 characters' })
	@IsEmail({}, { message: 'email must be a valid email' })
	@IsString({ message: 'email must be a string' })
	email: string

	@ApiProperty({ description: 'The password' })
	@Length(6, 30, { message: 'password must be between 6 and 30 characters' })
	@IsString({ message: 'password must be a string' })
	password: string

	@ApiProperty({ description: 'The name' })
	@Length(3, 50, { message: 'name must be between 3 and 50 characters' })
	@IsString({ message: 'name must be a string' })
	name: string

	@ApiProperty({ description: 'The cpf' })
	@Length(11, 11, { message: 'cpf must be 11 characters' })
	@IsString({ message: 'cpf must be a string' })
	cpf: string
	
	@ApiProperty({ description: 'The phone' })
	@Length(10, 15, { message: 'phone must be between 10 and 15 characters' })
	@IsString({ message: 'phone must be a string' })
	phone: string
}

export class LoginWithGoogleDto {
	@ApiProperty({ description: 'The email' })
	@IsEmail({}, { message: 'email must be a valid email' })
	@IsString({ message: 'email must be a string' })
	email: string
}

export class UpdateUserTierDto {
	@ApiProperty({ description: 'The tier' })
	@IsIn(['FREE', 'PREMIUM'] as Tier[], { message: 'tier must be a valid tier' })
	tier: Tier
}

export class UpdateUserCreditsDto {
	@ApiProperty({ description: 'The credits' })
	@IsInt({ message: 'credits must be a number' })
	credits: number
}
