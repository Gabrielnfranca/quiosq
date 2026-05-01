package com.webone.quiosq.service.impl;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import com.webone.quiosq.controller.response.QrCodeGenerateResponse;
import com.webone.quiosq.service.QrCodeGeneratorService;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class QrCodeGeneratorServiceImpl implements QrCodeGeneratorService {

    private static final int WIDTH = 200;
    private static final int HEIGHT = 200;
    private static final String PNG = "PNG";

    private final String frontUrl;

    public QrCodeGeneratorServiceImpl(@Value("${front-url}") String frontUrl) {
        this.frontUrl = frontUrl;
    }

    @Override
    public QrCodeGenerateResponse generateAndUploadQrCode(String text)
        throws WriterException, IOException {
        String message = String.format("%s/%s", frontUrl, text);
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(message, BarcodeFormat.QR_CODE, WIDTH, HEIGHT);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, PNG, pngOutputStream);
        byte[] pngQrCodeData = pngOutputStream.toByteArray();
        return new QrCodeGenerateResponse(pngQrCodeData, message);
    }
}
