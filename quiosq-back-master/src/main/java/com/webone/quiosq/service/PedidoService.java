package com.webone.quiosq.service;

import com.webone.quiosq.dto.PedidoDto;
import com.webone.quiosq.dto.PedidoItemDto;
import com.webone.quiosq.entity.Pedido;
import com.webone.quiosq.entity.PedidoItem;
import com.webone.quiosq.repository.PedidoRepository;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;

    public Page<PedidoDto> findAllPageable(Map<String, String> params, UUID quiosqueId) {
        int page = params.containsKey("page") ? Integer.parseInt(params.get("page")) : 0;
        int size = params.containsKey("size") ? Integer.parseInt(params.get("size")) : 10;
        
        String sortParams = params.getOrDefault("sort", "dataInit,desc");
        String[] sortOptions = sortParams.split(",");
        Sort sort = Sort.by(Sort.Direction.fromString(sortOptions.length > 1 ? sortOptions[1] : "desc"), sortOptions[0]);
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        String codigo = params.get("codigo");
        String status = params.get("status");

        Page<Pedido> pedidos = pedidoRepository.findAllByQuiosqueIdAndFilters(quiosqueId, codigo, status, pageable);
        return pedidos.map(this::toDto);
    }

    private PedidoDto toDto(Pedido pedido) {
        PedidoDto dto = new PedidoDto();
        dto.setId(pedido.getId());
        dto.setCodigo(pedido.getCodigo());
        dto.setNomePedido(pedido.getNomePedido());
        dto.setMesa(pedido.getMesa() != null ? String.valueOf(pedido.getMesa().getNumero()) : null);
        dto.setDataInit(pedido.getDataInit());
        dto.setDataFim(pedido.getDataFim());
        dto.setDataContagem(pedido.getDataContagem());
        dto.setStatus(pedido.getStatus());
        dto.setTotal(pedido.getTotal());
        dto.setCliente(pedido.getCliente());
        dto.setObservacoes(pedido.getObservacoes());
        
        if (pedido.getItens() != null) {
            dto.setItens(pedido.getItens().stream().map(this::toItemDto).collect(Collectors.toList()));
        }
        return dto;
    }

    private PedidoItemDto toItemDto(PedidoItem item) {
        PedidoItemDto dto = new PedidoItemDto();
        dto.setId(item.getId());
        dto.setDescricao(item.getDescricao());
        dto.setCategoria(item.getCategoria());
        dto.setQuantidade(item.getQuantidade());
        dto.setPreco(item.getPreco());
        dto.setTotal(item.getTotal());
        return dto;
    }
}