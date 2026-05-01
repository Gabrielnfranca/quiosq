package com.webone.quiosq.repository;

import com.webone.quiosq.entity.Mesa;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, UUID> {
    Page<Mesa> findByQuiosqueId(UUID quiosqueId, Pageable pageable);
    Page<Mesa> findByQuiosqueIdAndNumero(UUID quiosqueId, Integer numero, Pageable pageable);
    boolean existsByQuiosqueIdAndNumero(UUID quiosqueId, Integer numero);
    java.util.List<Mesa> findByGarcomId(UUID garcomId);
    void deleteByQuiosqueId(UUID quiosqueId);
}
