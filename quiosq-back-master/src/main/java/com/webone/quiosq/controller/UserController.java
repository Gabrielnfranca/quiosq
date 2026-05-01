package com.webone.quiosq.controller;

import com.webone.quiosq.dto.CreateUserDto;
import com.webone.quiosq.dto.UpdateUserDto;
import com.webone.quiosq.dto.UserDto;
import com.webone.quiosq.service.UserService;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/users")
public class UserController {

  private final UserService userService;

  @PostMapping
  public ResponseEntity<Void> createUser(@RequestBody CreateUserDto createUserDto) {
    userService.createUser(createUserDto);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @PutMapping
  public ResponseEntity<Void> updateUser(@RequestBody UpdateUserDto createUserDto) {
    userService.update(createUserDto);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserDto> findById(@PathVariable final UUID id) {
    return new ResponseEntity<>(userService.findById(id), HttpStatus.OK);
  }

  @GetMapping()
  public ResponseEntity<Page<UserDto>> findAllPageable(
      @RequestParam(value = "page", defaultValue = "0") Integer page,
      @RequestParam(value = "size", defaultValue = "10") Integer size,
      @RequestParam(value = "orderBy", defaultValue = "nome") String orderBy,
      @RequestParam(value = "direction", defaultValue = "ASC") String direction
  ) {

    return new ResponseEntity<>(userService.findAllByPageable(page, size, orderBy, direction),
        HttpStatus.OK);
  }
}
