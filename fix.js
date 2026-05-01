const fs = require('fs');

const qrPath = 'C:\\SISTEMA\\QuiosQ\\quiosq_novo\\quiosque_angular_adm-dev\\src\\app\\service\\qrcode.service.ts';
let qrContent = fs.readFileSync(qrPath, 'utf8');
qrContent = qrContent.replace('\/api/v1/qrcode/\/\\', '/api/v1/qrcode//');
qrContent = qrContent.replace('get<QrCodeGenerateResponse>(', 'get<QrCodeGenerateResponse>(');
qrContent = qrContent.replace('quiosqueId}));', 'quiosqueId});');
// Just manually rewrite the line completely:
qrContent = qrContent.replace(/return this\.http\.get.*/, 'return this.http.get<QrCodeGenerateResponse>(${environment.apiUrl}/api/v1/qrcode//);');
fs.writeFileSync(qrPath, qrContent, 'utf8');
console.log('Fixed qrcode');

const mesaPath = 'C:\\SISTEMA\\QuiosQ\\quiosq_novo\\quiosque_angular_adm-dev\\src\\app\\pages\\cadastro\\mesa\\mesa.ts';
let mContent = fs.readFileSync(mesaPath, 'utf8');

// Clean up printQrCode block
let printCode = \
    printQrCode() {
        if (this.mesasParaImprimir.length === 0) return;
        
        let sizeCss = 'width: 250px;'; // Default Medium
        let textCss = 'font-size: 24px;';

        if (this.printTamanho === 'small') {
            sizeCss = 'width: 120px;';
            textCss = 'font-size: 16px;';
        } else if (this.printTamanho === 'large') {
            sizeCss = 'width: 450px;';
            textCss = 'font-size: 34px;';
        }

        let cardsHtml = '';
        for (const item of this.mesasParaImprimir) {
            cardsHtml += \\\\\\\
                <div class="qr-card" style="\\\\\">
                    <h2 style="\\\\\">Mesa \\\\\</h2>
                    <img src="\\\\\" alt="QR Code Mesa" />
                    <p style="font-size: 0.85em;">Escaneie para fazer seu pedido</p>
                </div>
            \\\\\\\;
        }

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(\\\\\\\
                <html>
                    <head>
                        <title>Imprimir QR Codes</title>
                        <style>
                            body {
                                display: flex;
                                flex-wrap: wrap;
                                gap: 20px;
                                justify-content: center;
                                font-family: sans-serif;
                                margin: 20px;
                            }
                            .qr-card {
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                border: 2px dashed #ccc;
                                padding: 15px;
                                border-radius: 8px;
                                page-break-inside: avoid;
                                text-align: center;
                            }
                            img {
                                max-width: 100%;
                                height: auto;
                            }
                            h2 {
                                margin: 0 0 10px 0;
                                color: #333;
                            }
                            p {
                                color: #666;
                                margin: 10px 0 0 0;
                                font-weight: bold;
                            }
                            @media print {
                                body {
                                    -webkit-print-color-adjust: exact;
                                }
                            }
                        </style>
                    </head>
                    <body onload="setTimeout(function(){ window.print(); window.close(); }, 500);">
                        \\\\\
                    </body>
                </html>
            \\\\\\\);
            win.document.close();
        }
    }
}
\;
// replace the printQrCode method with the correct one
mContent = mContent.replace(/printQrCode\(\) \{[\s\S]*\}\s*\}\s*$/m, printCode.replace(/\\\\\\\\/g, '').replace(/\\\\\\/g, '\').replace(/\\\\\$/g, '\$'));

fs.writeFileSync(mesaPath, mContent, 'utf8');
console.log('Fixed mesa');

