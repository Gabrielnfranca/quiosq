package com.webone.quiosq.controller;

import com.google.zxing.WriterException;
import com.webone.quiosq.controller.response.QrCodeGenerateResponse;
import com.webone.quiosq.service.QrCodeService;
import java.io.IOException;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/qrcode")
@AllArgsConstructor
public class QrCodeController {

    private final QrCodeService service;

    @GetMapping("/{mesaId}/{quiosqueId}")
    public ResponseEntity<QrCodeGenerateResponse> create(
        @PathVariable("mesaId") Long mesaId,
        @PathVariable("quiosqueId") UUID quiosqueId)
        throws IOException, WriterException {
        return new ResponseEntity<>(
            service.generateAndUploadQrCode(quiosqueId, mesaId),
            HttpStatus.CREATED);
    }
}
