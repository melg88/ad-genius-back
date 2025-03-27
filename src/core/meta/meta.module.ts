import { Global, Module } from '@nestjs/common'
import { MetaService } from './meta.service'
import { MetaController } from './meta.controller'

@Module({
    providers: [MetaService],
    exports: [MetaService],
    controllers: [MetaController],
})
export class MetaModule {}
