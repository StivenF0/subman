package com.subman.submanapi.service;

import com.subman.submanapi.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtTokenService {

    private final SecretKey signingKey;
    private final long expirationTime;

    public JwtTokenService(
            @Value("${app.jwt.secret}") String secretKey,
            @Value("${app.jwt.expiration-ms}") long expirationTime) {

        this.signingKey = Keys.hmacShaKeyFor(secretKey.getBytes());
        this.expirationTime = expirationTime;
    }

    private SecretKey getSigningKey() {
        return this.signingKey;
    }

    /**
     * Gera um novo token JWT para um usuário.
     */
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("userName", user.getNome());

        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date expirationDate = new Date(nowMillis + this.expirationTime);

        return Jwts.builder()
                .claims(claims)
                .subject(user.getEmail())
                .issuedAt(now)
                .expiration(expirationDate)
                .signWith(getSigningKey())
                .compact();
    }

    // --- Métodos para Validar e Ler o Token ---

    /**
     * Extrai o "Subject" (o email do usuário) do token.
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrai o ID do usuário de dentro do payload do token.
     */
    public Long extractUserId(String token) {
        final Claims claims = extractAllClaims(token);
        return ((Number) claims.get("userId")).longValue();
    }

    /**
     * Verifica se o token é válido (não expirou e pertence ao usuário).
     */
    public boolean validateToken(String token, User user) {
        final String email = extractEmail(token);
        return (email.equals(user.getEmail()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}