package com.webone.quiosq.controller;

import com.webone.quiosq.dto.PedidoCreateDto;
import com.webone.quiosq.dto.PedidoDto;
import com.webone.quiosq.service.PedidoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/cardapio/pedido")
@AllArgsConstructor
public class CardapioPedidoController {

    private final PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoDto> createPedido(@RequestBody PedidoCreateDto dto) {
        return ResponseEntity.ok(pedidoService.createPedido(dto));
    }
}
