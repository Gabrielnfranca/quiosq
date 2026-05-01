package com.webone.quiosq.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class PedidoItemDto {
    private UUID id;
    private String descricao;
    private String categoria;
    private Integer quantidade;
    private Double preco;
    private Double total;
}