package com.webone.quiosq.dto;


import com.webone.quiosq.entity.enums.RoleName;

public record CreateUserDto(

        String email,
        String nome,
        String password,
        RoleName role

) {
}
