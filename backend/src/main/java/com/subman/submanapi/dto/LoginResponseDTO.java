package com.subman.submanapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO (Data Transfer Object) para a resposta de um login bem-sucedido.
 * Ele agrupa os dados seguros do usuário (o UserResponseDTO)
 * e o token de acesso (JWT).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor // Útil para criar a resposta no controller
public class LoginResponseDTO {

    // Os dados do usuário (ID, Nome, Email)
    private UserResponseDTO user;

    // O token JWT
    private String token;
}