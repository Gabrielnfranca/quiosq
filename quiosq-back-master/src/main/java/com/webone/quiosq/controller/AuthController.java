package com.webone.quiosq.controller;

import com.webone.quiosq.config.SecurityConfiguration;
import com.webone.quiosq.dto.LoginUserDto;
import com.webone.quiosq.dto.RecoveryJwtTokenDto;
import com.webone.quiosq.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("api/v1/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping
    public ResponseEntity<RecoveryJwtTokenDto> authenticateUser(
        @RequestBody LoginUserDto loginUserDto) {

        return new ResponseEntity<>(authService.authenticateUser(loginUserDto), HttpStatus.OK);
    }

    @RequestMapping(value = "/refresh_token", method = RequestMethod.POST)
    public ResponseEntity<Void> refreshToken(HttpServletResponse response) {

        // String token = JWTUtil.generateToken(usuaioAutenticado.getEmail());
        // response.setHeader("Authorization", "Bearer " + usuaioAutenticado.getEmail());
        response.addHeader("access-control-expose-headers", "Authorization");
        return ResponseEntity.noContent().build();
    }

}
