import { Module } from '@nestjs/common';
import { IdentityModule } from '@core/identity/identity.module';
import { PrismaModule } from './services/prisma/prisma.module';
import { FirebaseModule } from './services/firebase/firebase.module';
import { OpenaiModule } from './services/openai/openai.module'; // Importa o OpenaiModule

@Module({
  imports: [IdentityModule, PrismaModule, FirebaseModule, OpenaiModule], // Adiciona OpenaiModule
  controllers: [],
  providers: []
})
export class AppModule {}
