package com.webone.quiosq.service;


import com.webone.quiosq.dto.JwtPayload;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private final String secret = "u8Fz9kLhQ2mX7pR1tYwZ3sV6nBqD4jH5cT7vX9yL2mN0aP3rQ5uW8xZ1cE4fG7hJ";


    public String generateClientWithoutExpiration(UUID quiosqueId, Long mesaId) {
        return Jwts.builder()
            .setSubject("visitante")
            .claim("role", "cliente")
            .claim("quiosque_id", quiosqueId.toString())
            .claim("mesa", mesaId)
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
            .compact();
    }
    public String generateClientToken(UUID quiosqueId, Duration ttl) {
        Instant now = Instant.now();
        return Jwts.builder()
            .setSubject("visitante")
            .claim("role", "cliente")
            .claim("quiosque_id", quiosqueId.toString())
            .setId(UUID.randomUUID().toString())
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(now.plus(ttl)))
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
            .compact();
    }

    public String generateAdminToken(UUID userId, List<String> roles, List<UUID> quiosques,
        Duration ttl) {
        Instant now = Instant.now();

        return Jwts.builder()
            .setSubject(userId.toString())
            .claim("roles", roles)
            .claim("quiosques", quiosques.stream().map(UUID::toString).toList())
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(now.plus(ttl)))
            .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
            .compact();
    }

    public JwtPayload parse(String token) {
        try {
            Claims c = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();

            JwtPayload p = new JwtPayload();
            p.setSubject(c.getSubject());
            p.setRole((String) c.get("role"));
            p.setMesaId((Integer) c.get("mesa"));
            p.setQuiosqueId(UUID.fromString((String) c.get("quiosque_id")));
            p.setRoles((List<String>) c.getOrDefault("roles", List.of()));
            List<String> qs = (List<String>) c.getOrDefault("quiosques", List.of());
            p.setQuiosques(qs.stream().map(UUID::fromString).toList());
            return p;
        } catch (Exception e) {
            System.out.print(e.getMessage());
            return null;
        }
    }
}