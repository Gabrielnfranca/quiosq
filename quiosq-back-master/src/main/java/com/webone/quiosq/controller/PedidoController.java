package com.webone.quiosq.controller;

import com.webone.quiosq.dto.PedidoDto;
import com.webone.quiosq.service.PedidoService;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/admin/pedido")
@AllArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping("/{quiosqueId}/pageable")
    public ResponseEntity<Page<PedidoDto>> findAllPageable(
        @PathVariable UUID quiosqueId,
        @RequestParam Map<String, String> params) {
        
        return ResponseEntity.ok(pedidoService.findAllPageable(params, quiosqueId));
    }
}