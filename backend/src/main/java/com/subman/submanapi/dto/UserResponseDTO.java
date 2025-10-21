package com.subman.submanapi.dto;

import com.subman.submanapi.model.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String nome;
    private String email;

    public UserResponseDTO(User usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
    }

    public static List<UserResponseDTO> fromEntityList(List<User> usuarios) {
        return usuarios.stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
    }
}
