package com.webone.quiosq.repository;

import com.webone.quiosq.entity.Quiosque;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuiosqueRepository extends JpaRepository<Quiosque, UUID> {
}
