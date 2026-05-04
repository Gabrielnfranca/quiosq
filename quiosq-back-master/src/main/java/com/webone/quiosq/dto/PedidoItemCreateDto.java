package com.webone.quiosq.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class PedidoItemCreateDto {
    private String productId;
    private String name;
    private Integer quantity;
    private Double price;
}
