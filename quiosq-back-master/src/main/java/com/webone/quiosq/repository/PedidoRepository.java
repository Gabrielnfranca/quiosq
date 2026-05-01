package com.webone.quiosq.repository;

import com.webone.quiosq.entity.Pedido;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    @Query("SELECT p FROM Pedido p WHERE p.quiosque.id = :quiosqueId " +
           "AND (:codigo IS NULL OR LOWER(p.codigo) LIKE LOWER(CONCAT('%', cast(:codigo as string), '%'))) " +
           "AND (:status IS NULL OR p.status = :status)")
    Page<Pedido> findAllByQuiosqueIdAndFilters(
            UUID quiosqueId,
            String codigo,
            String status,
            Pageable pageable);
}