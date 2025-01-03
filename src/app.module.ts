import { Module } from '@nestjs/common'
import { IdentityModule } from '@core/identity/identity.module'
import { PrismaModule } from './services/prisma/prisma.module'
import { FirebaseModule } from './services/firebase/firebase.module'

@Module({
	imports: [IdentityModule, PrismaModule, FirebaseModule],
	controllers: [],
	providers: []
})
export class AppModule {}
