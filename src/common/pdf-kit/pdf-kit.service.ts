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
	border?: {
		color: PDFKit.Mixins.ColorValue,
		thickness?: number;
		radius?: number;
	};
	color?: PDFKit.Mixins.ColorValue;
	frColor?: PDFKit.Mixins.ColorValue;
	bgColor?: PDFKit.Mixins.ColorValue;
	lineThickness?: number;
	listItems?: string[] | number[];
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
		// https://pdfkit.org/docs/text.html#fonts
		document.fontSize(font?.size || 14)
			.fillColor(text.color || '#4e5560')
			.font(font?.name || 'Helvetica')
			.text(text.value.toString(), xAxis || 0, yAxis || 0, {
				...options,
				wordSpacing: .2,
				characterSpacing: options?.characterSpacing || .5
			});
	}


	RenderRectangle({ document, xAxis, yAxis, width, height, frColor, bgColor, border }: IPdfKitParams): void {
		document.lineWidth(border?.thickness || 0);
		document.strokeColor(border?.color).roundedRect(xAxis, yAxis, width, height, border?.radius).fillAndStroke(bgColor, frColor).stroke();
	}

	RenderLine({ document, color, lineThickness, width, xAxis, yAxis }: IPdfKitParams): void {
		document.strokeColor(color || "#eef3fb")
			.lineWidth(lineThickness || 1.2)
			.moveTo(xAxis || 0, yAxis)
			.lineTo(width, yAxis)
			.stroke();
	}


	async RenderImage({ document, imageUrl, xAxis, yAxis, options }: IPdfKitParams): Promise<void> {
		document.image(imageUrl, xAxis, yAxis, { ...options });
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
		const payload = typeof qrData === 'string' ? qrData : JSON.stringify(qrData);
		let qrImage = await QRCode.toDataURL(payload, {
			width: 200,
			margin: 2,
			color: { dark: '#3B3D45', light: '#fff' }
		});
		return qrImage;  //`data:image/png;base64,${}`;
	}

}