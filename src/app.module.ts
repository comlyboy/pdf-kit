import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PdfKitModule } from './common/pdf-kit/pdf-kit.module';
import { PdfModule } from './core/pdf/pdf.module';

@Module({
  imports: [PdfKitModule, PdfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
