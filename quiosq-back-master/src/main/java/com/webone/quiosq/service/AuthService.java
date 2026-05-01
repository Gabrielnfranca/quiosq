package com.webone.quiosq.service;


import com.webone.quiosq.dto.LoginUserDto;
import com.webone.quiosq.dto.RecoveryJwtTokenDto;

public interface AuthService {

    RecoveryJwtTokenDto authenticateUser(LoginUserDto loginUserDto);

}
