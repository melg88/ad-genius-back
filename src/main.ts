import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)
	app.enableCors()
	const config = new DocumentBuilder()
		.setTitle('AdGenius API')
		.setDescription('The AdGenius API description')
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('docs', app, document)
	app.useGlobalPipes(new ValidationPipe())
	await app.listen(process.env.PORT || 3000)
}
bootstrap()
