package com.webone.quiosq.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pedido")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String codigo;
    
    @Column(name = "nome_pedido")
    private String nomePedido;

    @ManyToOne
    @JoinColumn(name = "mesa_id")
    private Mesa mesa;

    @Column(name = "data_init")
    private LocalDateTime dataInit;

    @Column(name = "data_fim")
    private LocalDateTime dataFim;

    @Column(name = "data_contagem")
    private LocalDateTime dataContagem;

    private String status;
    
    private Double total;
    
    private String cliente;
    
    private String observacoes;

    @ManyToOne
    @JoinColumn(name = "quiosque_id", nullable = false)
    private Quiosque quiosque;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItem> itens;
}