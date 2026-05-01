package com.webone.quiosq.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MesaLoteDto {
    private Integer numeroInicial;
    private Integer numeroFinal;
    private UUID garcomId;
}
