package com.webone.quiosq.dto;

import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GarcomDto {
    private UUID id;
    private String nome;
    private String cpf;
    private Boolean status;
}
