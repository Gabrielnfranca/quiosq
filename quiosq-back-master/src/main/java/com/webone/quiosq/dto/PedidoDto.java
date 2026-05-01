package com.webone.quiosq.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class PedidoDto {
    private UUID id;
    private String codigo;
    private String nomePedido;
    private String mesa;
    private LocalDateTime dataInit;
    private LocalDateTime dataFim;
    private LocalDateTime dataContagem;
    private String status;
    private List<PedidoItemDto> itens;
    private Double total;
    private String cliente;
    private String observacoes;
}