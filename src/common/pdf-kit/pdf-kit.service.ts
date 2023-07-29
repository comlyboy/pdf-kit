import { Injectable } from '@nestjs/common';

import QRCode from 'qrcode';
import { Base64Encode } from 'base64-stream';
import PDFDocument from 'pdfkit';

interface IPdfKitParams {
	document: PDFKit.PDFDocument;
	text?: {
		value: string | number | boolean,
		color?: string;
	};
	font?: {
		size?: number;
		name?: PDFKit.Mixins.PDFFontSource;
		url?: string;
	};
	xAxis?: number;
	yAxis?: number;
	width?: number;
	height?: number;
	border?: { thickness: number; radius: number; };
	frColor?: PDFKit.Mixins.ColorValue;
	bgColor?: PDFKit.Mixins.ColorValue;
	lineThickness?: number;
	imageUrl?: string;
	documentType?: 'image' | 'pdf';
	options?: PDFKit.Mixins.TextOptions & PDFKit.Mixins.ImageOption;
}
@Injectable()
export class PdfKitService {
	// jsPDF
	// pdfkit
	// pdfmake
	// jsPDF-AutoTable
	// https://www.youtube.com/watch?v=fKewAlUwRPk
	// https://codepen.io/Lubna/pen/yLagaoZ
	// https://www.youtube.com/watch?v=dcjUK8wqlUc
	// https://codepen.io/reallygoodemails/pen/xZOJoe
	// https://codepen.io/JewettCitySoftwareCorporation/pen/GLLBeG
	// https://stackoverflow.com/questions/39147196/get-pdfkit-as-base64-string
	// https://blogs.sap.com/2021/05/28/microservices-generating-pdf-with-node.js-pdfkit/
	// https://parallelcodes.com/node-js-create-pdf-documents-with-images/
	// https://stackoverflow.com/questions/39147196/get-pdfkit-as-base64-string



	constructor() { }


	InitialisePdfKit(options: PDFKit.PDFDocumentOptions): PDFKit.PDFDocument {
		return new PDFDocument({
			...options,
			pdfVersion: '1.7',
			margins: { left: 0, right: 0, bottom: 0, top: 0 },
		});
	}

	RenderText({ document, text, font, xAxis, yAxis, options }: IPdfKitParams): void {
		document.fontSize(font?.size || 14)
			.fillColor(text.color || '#4e5560')
			.font(font?.name || 'Helvetica')
			.text(text.value.toString(), xAxis || 0, yAxis || 0, {
				...options,
				wordSpacing: .2,
				characterSpacing: options?.characterSpacing || .5
			});
	}

	RenderCircle({ document, xAxis, yAxis, bgColor }: IPdfKitParams): void {
		document.circle(xAxis, yAxis, 50)
			.fill(bgColor || '#9165c3');
	}

	RenderRectangle({ document, xAxis, yAxis, width, height, bgColor }: IPdfKitParams): void {
		document.rect(xAxis, yAxis, width, height);
		document.fill(bgColor).stroke();
	}


	RenderInitial({ document, text, xAxis, yAxis }: IPdfKitParams): void {
		document.fontSize(10)
			.fillColor(text.color)
			.text(text.value.toString(), xAxis, yAxis, {
				align: "center",
				characterSpacing: .5
			});
	}

	RenderLine({ document, frColor, lineThickness, width, yAxis }: IPdfKitParams): void {
		document.strokeColor(frColor || "#eef3fb")
			.lineWidth(lineThickness || 1.2)
			.moveTo(0, yAxis)
			.lineTo(width, yAxis)
			.stroke();
	}


	async RenderImage({ document, imageUrl, xAxis, yAxis, options }: IPdfKitParams): Promise<void> {
		document.image(imageUrl, xAxis, yAxis, { ...options });
	}


	SetFont({ document, font }: IPdfKitParams): void {
		document.font(font.name);
	}


	GenerateResult({ document, documentType = 'pdf' }: IPdfKitParams): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			let base64String = ''; // To contains the base64 string
			const stream = document.pipe(new Base64Encode());
			document.end(); // will trigger the stream to end
			stream.on('data', (chunk) => { base64String += chunk; });
			stream.on('end', () => {
				resolve(`data:application/pdf;base64,${base64String}`);
			});
			stream.on('error', (error: Error) => {
				reject(error.message);
			});
		});
	}


	async RegisterFont({ document, font }: IPdfKitParams) {
		const fetchedFont = await fetch(font.url)
		const fetchedFontBuffer = await fetchedFont.arrayBuffer();
		document.registerFont(font.name.toString(), fetchedFontBuffer);
	}


	async GenerateQrCode<TData>(qrData: TData): Promise<string> {
		const payload = JSON.stringify(qrData);
		let qrImage = await QRCode.toDataURL(payload, {
			width: 200,
			margin: 2,
			color: { dark: '#3B3D45', light: '#fff' }
		});
		return qrImage;  //`data:image/png;base64,${}`;
	}

}