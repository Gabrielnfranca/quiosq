package com.webone.quiosq.service;

import com.webone.quiosq.entity.User;
import com.webone.quiosq.exception.UnauthorizedException;
import com.webone.quiosq.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UnauthorizedException("Usuário não encontrado."));
        return new UserDetailsImpl(user);
    }

}
