import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as express from 'express'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.use(express.json({ limit: '50mb' }))
	app.use(express.urlencoded({ limit: '50mb', extended: false }))
	app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
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
