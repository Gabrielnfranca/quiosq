package com.webone.quiosq.service;

import com.google.zxing.WriterException;
import com.webone.quiosq.controller.response.QrCodeGenerateResponse;
import java.io.IOException;
import java.util.UUID;

public interface QrCodeService {
    QrCodeGenerateResponse generateAndUploadQrCode(UUID quisoqueId, UUID mesaId) throws WriterException, IOException;
}
