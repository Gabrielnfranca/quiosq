package com.webone.quiosq.service.impl;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.webone.quiosq.config.SecurityConfiguration;
import com.webone.quiosq.dto.CreateUserDto;
import com.webone.quiosq.dto.UpdateUserDto;
import com.webone.quiosq.dto.UserDto;
import com.webone.quiosq.entity.Role;
import com.webone.quiosq.entity.User;
import com.webone.quiosq.repository.RoleRepository;
import com.webone.quiosq.repository.UserRepository;
import com.webone.quiosq.service.UserService;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor

public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    private final SecurityConfiguration securityConfiguration;
    private final RoleRepository roleRepository;
    private final ObjectMapper modelMapper;

    // Método responsável por criar um usuário
    @Override
    public void createUser(final CreateUserDto createUserDto) {
        final Optional<Role> role = roleRepository.findByNome(createUserDto.role());

        if (role.isEmpty()) {
            throw new IllegalArgumentException("Role não encontrado");
        }
        User newUser = User.builder()
            .email(createUserDto.email())
            .nome(createUserDto.nome())
            // Codifica a senha do usuário com o algoritmo bcrypt
            .password(securityConfiguration.passwordEncoder().encode(createUserDto.password()))
            .roles(List.of(role.get()))
            .build();

        // Salva o novo usuário no banco de dados
        userRepository.save(newUser);
    }

    @Override
    public void update(final UpdateUserDto updateUserDto) {
        var user = userRepository.findById(updateUserDto.id())
            .orElseThrow(() -> new IllegalArgumentException("Usuario não encontrado!"));
        user.setEmail(updateUserDto.email());
        user.getRoles().addAll(updateUserDto.roles());
        userRepository.save(user);

    }

    @Override
    public UserDto findById(final UUID id) {
        final var userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Usuario não encontrado!");
        }
        return modelMapper.convertValue(userOpt.get(), UserDto.class);

    }

    @Override
    public Page<UserDto> findAllByPageable(Integer page, Integer size, String orderBy,
        String direction) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.Direction.valueOf(direction),
            orderBy);
        return userRepository.findAll(pageRequest)
            .map(f -> modelMapper.convertValue(f, UserDto.class));

    }


}
