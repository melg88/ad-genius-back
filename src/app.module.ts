import { Module } from '@nestjs/common'
import { IdentityModule } from '@core/identity/identity.module'
import { PrismaModule } from './services/prisma/prisma.module'
import { FirebaseModule } from './services/firebase/firebase.module'
import { OpenaiModule } from './services/openai/openai.module'
import { AdModule } from '@core/ad/ad.module'
import { VideoModule } from './services/video/video.module'
import { StorageModule } from './services/storage/storage.module'
import { ConfigModule } from '@nestjs/config'
import { configuration } from './config'

@Module({
	imports: [
		ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
		IdentityModule,
		AdModule,
		PrismaModule,
		FirebaseModule,
		StorageModule,
		OpenaiModule,
		VideoModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
