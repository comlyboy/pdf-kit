import { Global, Module } from '@nestjs/common';

import { PdfKitService } from './pdf-kit.service';

@Global()
@Module({
	providers: [PdfKitService],
	exports: [PdfKitService]
})
export class PdfKitModule { }
