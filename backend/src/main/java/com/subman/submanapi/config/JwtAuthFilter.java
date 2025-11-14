package com.subman.submanapi.config;

import com.subman.submanapi.model.User;
import com.subman.submanapi.repository.UserRepository;
import com.subman.submanapi.service.JwtTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Este é o "Porteiro" da API.
 * Ele é um filtro que é executado UMA VEZ para CADA pedido que chega.
 * A sua missão é verificar se o pedido tem um Token JWT válido.
 */
@Component // Diz ao Spring para gerir esta classe
public class JwtAuthFilter extends OncePerRequestFilter {

    // Injetamos os nossos serviços
    private final JwtTokenService jwtTokenService;
    private final UserRepository userRepository;

    @Autowired
    public JwtAuthFilter(JwtTokenService jwtTokenService, UserRepository userRepository) {
        this.jwtTokenService = jwtTokenService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        final Long userId;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            userEmail = jwtTokenService.extractEmail(jwt);
            userId = jwtTokenService.extractUserId(jwt);
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
            return;
        }

        if (userEmail != null && userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = this.userRepository.findById(userId)
                    .orElse(null);

            if (user != null && jwtTokenService.validateToken(jwt, user)) {

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        null
                );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}