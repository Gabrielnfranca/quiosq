package com.webone.quiosq.dto;

import com.webone.quiosq.entity.Role;
import java.util.List;
import java.util.UUID;

public record UpdateUserDto(
    UUID id,
    String email,
    List<Role> roles

) {

}
