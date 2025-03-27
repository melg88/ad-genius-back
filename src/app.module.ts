import { Module } from '@nestjs/common';
import { IdentityModule } from '@core/identity/identity.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { FirebaseModule } from './services/firebase/firebase.module';
import { OpenaiModule } from './services/openai/openai.module';
import { AdModule } from '@core/ad/ad.module';
import { MetaModule } from './core/meta/meta.module';

@Module({
  imports: [IdentityModule, AdModule, PrismaModule, FirebaseModule, OpenaiModule, MetaModule],
  controllers: [],
  providers: []
})
export class AppModule {}
