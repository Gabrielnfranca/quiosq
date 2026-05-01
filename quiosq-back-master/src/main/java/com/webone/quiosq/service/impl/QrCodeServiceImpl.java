package com.webone.quiosq.service.impl;

import com.google.zxing.WriterException;
import com.webone.quiosq.controller.response.QrCodeGenerateResponse;
import com.webone.quiosq.service.JwtService;
import com.webone.quiosq.service.QrCodeGeneratorService;
import com.webone.quiosq.service.QrCodeService;
import java.io.IOException;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class QrCodeServiceImpl implements QrCodeService {

    private final QrCodeGeneratorService service;

    private final JwtService jwtService;

    @Override
    public QrCodeGenerateResponse generateAndUploadQrCode(UUID quisoqueId, UUID mesaId)
        throws WriterException, IOException {
        jwtService.generateClientWithoutExpiration(quisoqueId,mesaId);
        return service.generateAndUploadQrCode(String.format("?me=%s", jwtService.generateClientWithoutExpiration(quisoqueId,mesaId)));
    }
}
