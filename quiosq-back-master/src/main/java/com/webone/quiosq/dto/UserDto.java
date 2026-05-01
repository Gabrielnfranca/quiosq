package com.webone.quiosq.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.webone.quiosq.entity.Role;
import com.webone.quiosq.entity.User;
import java.util.List;
import java.util.UUID;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto {

    private UUID id;
    private String email;
    private String nome;
    private byte[] image;
    private List<Role> roles;

    public UserDto(User user) {
        this.id = user.getId();
        this.roles = user.getRoles();
        this.email = user.getEmail();
        this.nome = user.getNome();
        this.image = user.getImage();
    }
}
