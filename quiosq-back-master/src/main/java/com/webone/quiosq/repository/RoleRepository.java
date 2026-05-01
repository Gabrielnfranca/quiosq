package com.webone.quiosq.repository;

import com.webone.quiosq.entity.Role;
import com.webone.quiosq.entity.enums.RoleName;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByNome(RoleName name);
}
