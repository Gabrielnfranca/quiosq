package com.webone.quiosq.service;

import com.webone.quiosq.dto.CreateUserDto;
import com.webone.quiosq.dto.UpdateUserDto;
import com.webone.quiosq.dto.UserDto;
import java.util.UUID;
import org.springframework.data.domain.Page;


public interface UserService {

  void createUser(CreateUserDto createUserDto);

  void update(UpdateUserDto updateUserDto);

  UserDto findById(UUID id);

  Page<UserDto> findAllByPageable(Integer page, Integer size, String orderBy, String direction);

}
