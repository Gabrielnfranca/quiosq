package com.webone.quiosq.service;

import com.google.zxing.WriterException;
import com.webone.quiosq.controller.response.QrCodeGenerateResponse;
import java.io.IOException;

public interface QrCodeGeneratorService {
     QrCodeGenerateResponse generateAndUploadQrCode(String text) throws WriterException, IOException;
}
