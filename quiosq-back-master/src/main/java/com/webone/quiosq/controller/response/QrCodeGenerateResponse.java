package com.webone.quiosq.controller.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QrCodeGenerateResponse {

    private byte[] url;
    private String urlText;
}
