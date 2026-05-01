package com.webone.quiosq.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {

    private static final String AMERICA_RECIFE = "America/Recife";
    private static final String ROLES = "roles";
    private final String secretKey;

    private static final String ISSUER = "noberto-api"; // Emissor do token

    public JwtTokenService(@Value("${jwt-secret-key}") String secretKey) {
        this.secretKey = secretKey;
    }

    public String generateToken(UserDetails user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            
            // Casting safe to UserDetailsImpl to get extra user properties
            String quiosqueId = "";
            String userName = user.getUsername();
            if (user instanceof com.webone.quiosq.service.UserDetailsImpl) {
                com.webone.quiosq.service.UserDetailsImpl userDetailsImpl = (com.webone.quiosq.service.UserDetailsImpl) user;
                if (userDetailsImpl.getUser().getQuiosque() != null && userDetailsImpl.getUser().getQuiosque().getId() != null) {
                    quiosqueId = userDetailsImpl.getUser().getQuiosque().getId().toString();
                }
                userName = userDetailsImpl.getUser().getNome();
            }

            return JWT.create()
                .withIssuer(ISSUER)
                .withIssuedAt(creationDate())
                .withExpiresAt(expirationDate())
                .withSubject(user.getUsername())
                .withClaim("quiosque_id", quiosqueId)
                .withClaim("user_name", userName)
                .withClaim(ROLES, user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList())

                )
                .sign(algorithm);

        } catch (JWTCreationException exception) {
            throw new JWTCreationException("Erro ao gerar token.", exception);
        }
    }

    public String getSubjectFromToken(String token) {

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.require(algorithm)
            .withIssuer(ISSUER)
            .build()
            .verify(token)
            .getSubject();

    }

    private Instant creationDate() {
        return ZonedDateTime.now(ZoneId.of(AMERICA_RECIFE)).toInstant();
    }

    private Instant expirationDate() {
        return ZonedDateTime.now(ZoneId.of(AMERICA_RECIFE)).plusHours(1).toInstant();
    }

}
