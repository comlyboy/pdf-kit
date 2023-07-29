import { HttpException, Injectable } from '@nestjs/common';

import { PdfKitService } from 'src/common/pdf-kit/pdf-kit.service';

@Injectable()
export class PdfService {

	constructor(private readonly pdfKitService: PdfKitService) { }

	async generateDocument() {
		try {
			const textColor = '#777777';
			const hospimanColor = '#aa87d0';
			const registrationUrl = 'https://staging.hospiman.com/patient/prospect/nq-802-363-105/create';
			const dimension = [420, 560];
			const document = this.pdfKitService.InitialisePdfKit({
				size: dimension,
				// size: 'a5',
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
				height: 230,
				bgColor: hospimanColor,
				width: dimension.at(0)
			});

			this.pdfKitService.RenderText({
				document,
				xAxis: 20,
				yAxis: 55,
				text: {
					value: 'Medical Metropolitant City Hospital Limited',
					color: '#fff'
				},
				font: { name: 'roboto-bold', size: 20, },
				options: {
					wordSpacing: .2,
					width: dimension.at(0) - 40,
					align: 'center',
					lineGap: 5,
					characterSpacing: .5
				}
			})


			this.pdfKitService.RenderRectangle({
				document,
				xAxis: 88,
				yAxis: 142,
				width: 245,
				height: 245,
				border: {
					color: hospimanColor,
					thickness: 2,
					radius: 5
				}
			})

			this.pdfKitService.RenderImage({
				document,
				xAxis: 90,
				yAxis: 145,
				imageUrl: await this.pdfKitService.GenerateQrCode(registrationUrl),
				options: { width: 240 }
			});

			this.pdfKitService.RenderText({
				document,
				xAxis: 0,
				yAxis: 395,
				text: {
					value: registrationUrl,
					color: textColor
				},
				font: { name: 'roboto', size: 10, },
				options: {
					width: dimension.at(0),
					align: 'center',
					lineGap: 2
				}
			})

			this.pdfKitService.RenderText({
				document,
				xAxis: 20,
				yAxis: 435,
				text: {
					value: 'Register yourself',
					color: hospimanColor
				},
				font: { name: 'roboto-bold', size: 16, },
				options: {
					width: dimension.at(0) - 40,
					align: 'center',
				}
			})

			this.pdfKitService.RenderText({
				document,
				xAxis: 20,
				yAxis: 460,
				text: {
					value: 'Scan the above QR code with you mobile phone to register yourself to into Medical Metropolitant City Hospital Limited',
					color: textColor
				},
				font: { name: 'roboto', size: 10, },
				options: {
					width: dimension.at(0) - 40,
					align: 'center',
					lineGap: 4
				}
			})

			this.pdfKitService.RenderLine({
				document,
				xAxis: 20,
				yAxis: 510,
				width: 400,
				color: '#ededed',
			})

			this.pdfKitService.RenderText({
				document,
				xAxis: 0,
				yAxis: 530,
				text: {
					value: '© 2023 - Hospiman solutions',
					color: textColor
				},
				font: { name: 'roboto', size: 10, },
				options: {
					width: dimension.at(0),
					align: 'center'
				}
			})




			return this.pdfKitService.GenerateResult({ document });
		} catch (error) {
			console.log(error);

			throw new HttpException(error?.message as any | 'Error occured!', error?.status || 500);
		}
	}



}
