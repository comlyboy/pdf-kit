import { HttpException, Injectable } from '@nestjs/common';

import { PdfKitService } from 'src/common/pdf-kit/pdf-kit.service';

@Injectable()
export class PdfService {

	constructor(private readonly pdfKitService: PdfKitService) { }

	async generateDocument() {
		try {
			const hospimanColor = '#9165c3';
			const registrationUrl = 'https://staging.hospiman.com/patient/prospect/nq-802-363-105/create';
			const dimension = [420, 560];
			const document = this.pdfKitService.InitialisePdfKit({
				size: dimension,
				layout: 'portrait',
				info: {
					Author: 'Hospiman Solutions',
					Title: 'Hospital information',
					Keywords: 'hospital-management emr',
					Producer: 'Hospiman Solutions',
					Creator: 'Hospiman Solutions',
				},
				pdfVersion: '1.7',
				margins: { left: 0, right: 0, bottom: 0, top: 0 },
			});

			await this.pdfKitService.RegisterFont({
				document,
				font: {
					name: 'roboto-bold',
					url: 'https://github.com/genbliz/static-assets/raw/main/Roboto/Roboto-Bold.ttf'
				}
			});
			await this.pdfKitService.RegisterFont({
				document,
				font: {
					name: 'roboto',
					url: 'https://github.com/genbliz/static-assets/raw/main/Roboto/Roboto-Regular.ttf'
				}
			});

			this.pdfKitService.RenderRectangle({
				document,
				xAxis: 0,
				yAxis: 0,
				height: 210,
				bgColor: hospimanColor,
				width: dimension.at(0)
			});

			this.pdfKitService.RenderText({
				// https://pdfkit.org/docs/text.html#fonts
				document,
				xAxis: 50,
				yAxis: 55,
				text: {
					value: 'Medical Metropolitant City Hospital Limited',
					color: '#fff'
				},
				font: { name: 'roboto-bold', size: 22, },
				options: {
					wordSpacing: .2,
					width: 320,
					align: 'center',
					lineGap: 5,
					characterSpacing: .5
				}
			})

			this.pdfKitService.RenderImage({
				document,
				xAxis: 110,
				yAxis: 145,
				imageUrl: await this.pdfKitService.GenerateQrCode(registrationUrl)
			});



			return this.pdfKitService.GenerateResult({ document });
		} catch (error) {
			console.log(error);

			throw new HttpException(error?.message as any | 'Error occured!', error?.status || 500);
		}
	}



}
