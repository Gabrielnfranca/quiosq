package com.webone.quiosq.repository;

import com.webone.quiosq.entity.Garcom;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GarcomRepository extends JpaRepository<Garcom, UUID> {
    Page<Garcom> findByQuiosqueId(UUID quiosqueId, Pageable pageable);
    Page<Garcom> findByQuiosqueIdAndNomeContainingIgnoreCase(UUID quiosqueId, String nome, Pageable pageable);
    List<Garcom> findByQuiosqueIdAndIdNot(UUID quiosqueId, UUID garcomId);
    List<Garcom> findByQuiosqueIdAndStatusTrue(UUID quiosqueId);
    java.util.Optional<Garcom> findByCpfAndQuiosqueId(String cpf, UUID quiosqueId);
}
