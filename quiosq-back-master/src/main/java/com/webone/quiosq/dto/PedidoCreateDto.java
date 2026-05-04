package com.webone.quiosq.dto;

import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class PedidoCreateDto {
    private UUID quiosqueId;
    private UUID mesaId;
    private String garcomNome;
    private String cliente;
    private String observacoes;
    private String paymentMethod;
    private List<PedidoItemCreateDto> itens;
}
