package com.webone.quiosq.service;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.resources.payment.Payment;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PagamentoService {
    
    public Payment criarPagamentoPix(Double valorTotal, String emailCliente, String descricao, UUID pedidoId) throws Exception {
        PaymentClient client = new PaymentClient();
        
        PaymentCreateRequest paymentCreateRequest =
            PaymentCreateRequest.builder()
                .transactionAmount(new BigDecimal(valorTotal.toString()))
                .description(descricao)
                .paymentMethodId("pix")
                .payer(
                    PaymentPayerRequest.builder()
                        .email(emailCliente != null && !emailCliente.isEmpty() ? emailCliente : "cliente@quiosq.com.br")
                        .build())
                .externalReference(pedidoId.toString())
                .build();
        
        return client.create(paymentCreateRequest);
    }
}

