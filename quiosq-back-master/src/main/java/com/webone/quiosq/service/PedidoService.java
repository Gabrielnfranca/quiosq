package com.webone.quiosq.service;

import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.payment.PaymentPointOfInteraction;
import com.webone.quiosq.dto.PedidoCreateDto;
import com.webone.quiosq.dto.PedidoDto;
import com.webone.quiosq.dto.PedidoItemCreateDto;
import com.webone.quiosq.dto.PedidoItemDto;
import com.webone.quiosq.entity.Mesa;
import com.webone.quiosq.entity.Pedido;
import com.webone.quiosq.entity.PedidoItem;
import com.webone.quiosq.entity.Quiosque;
import com.webone.quiosq.repository.MesaRepository;
import com.webone.quiosq.repository.PedidoRepository;
import com.webone.quiosq.repository.QuiosqueRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final MesaRepository mesaRepository;
    private final QuiosqueRepository quiosqueRepository;
    private final PagamentoService pagamentoService;

    @Transactional
    public PedidoDto createPedido(PedidoCreateDto dto) {
        Quiosque quiosque = quiosqueRepository.findById(dto.getQuiosqueId())
                .orElseThrow(() -> new RuntimeException("Quiosque não encontrado"));
                
        Mesa mesa = null;
        if (dto.getMesaId() != null) {
            mesa = mesaRepository.findById(dto.getMesaId()).orElse(null);
        }
        
        Pedido pedido = Pedido.builder()
                .quiosque(quiosque)
                .mesa(mesa)
                .cliente(dto.getCliente())
                .observacoes(dto.getObservacoes() + (dto.getPaymentMethod() != null ? " - Pagamento: " + dto.getPaymentMethod() : ""))
                .dataInit(LocalDateTime.now())
                .status("PENDENTE")
                // Gerar codigo aleatorio ou sequencial basico
                .codigo(UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .nomePedido(dto.getCliente() != null ? dto.getCliente() : "Cliente")
                .build();
                
        List<PedidoItem> itens = new ArrayList<>();
        double total = 0.0;
        
        if (dto.getItens() != null) {
            for (PedidoItemCreateDto itemDto : dto.getItens()) {
                double itemTotal = itemDto.getPrice() * itemDto.getQuantity();
                total += itemTotal;
                
                PedidoItem item = PedidoItem.builder()
                        .pedido(pedido)
                        .descricao(itemDto.getName())
                        .quantidade(itemDto.getQuantity())
                        .preco(itemDto.getPrice())
                        .total(itemTotal)
                        .categoria("GERAL")
                        .build();
                itens.add(item);
            }
        }
        
        // Adiciona taxa ou formata o total
        pedido.setTotal(total);
        pedido.setItens(itens);
        
        pedido = pedidoRepository.save(pedido);

        PedidoDto responseDto = toDto(pedido);

        // Se for PIX, cria o pagamento no mercado pago e retorna
        if ("PIX".equalsIgnoreCase(dto.getPaymentMethod())) {
            try {
                Payment payment = pagamentoService.criarPagamentoPix(
                    total, 
                    null, // Email (Pode depois pegar do cliente)
                    "Pedido " + pedido.getCodigo(), 
                    pedido.getId()
                );
                
                if (payment != null && payment.getPointOfInteraction() != null) {
                    com.mercadopago.resources.payment.PaymentTransactionData txData = payment.getPointOfInteraction().getTransactionData();
                    responseDto.setQrCodePix(txData.getQrCodeBase64());
                    responseDto.setPixCopiaECola(txData.getQrCode());
                    responseDto.setIdPagamentoMercadoPago(payment.getId());
                }
            } catch (Exception e) {
                // Em cenario real tratar log. Nao impedir pedido se pix falhar, ou ate jogar erro
                e.printStackTrace();
            }
        }
        
        return responseDto;
    }

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
