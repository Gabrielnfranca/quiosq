package com.webone.quiosq.dto;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MesaDto {
    private UUID id;
    private Integer numero;
    private Boolean status;
    private UUID garcomId;
    private String garcomNome;
}
