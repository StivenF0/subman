package com.subman.submanapi.controller;

import com.subman.submanapi.dto.LoginRequestDTO;
import com.subman.submanapi.dto.LoginResponseDTO; // NOVO IMPORT
import com.subman.submanapi.dto.UserResponseDTO;
import com.subman.submanapi.model.User;
import com.subman.submanapi.service.JwtTokenService; // NOVO IMPORT
import com.subman.submanapi.service.UserService;
// import org.springframework.beans.factory.annotation.Autowired; // Não é mais necessário
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;
    private final JwtTokenService jwtTokenService; // NOVO: Injetamos o serviço de token

    // ATUALIZADO: Injeção de dependência via construtor para ambos os serviços
    public UserController(UserService service, JwtTokenService jwtTokenService) {
        this.service = service;
        this.jwtTokenService = jwtTokenService;
    }

    @GetMapping
    public List<UserResponseDTO> listAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            UserResponseDTO novoUsuario = service.createUser(user);
            URI location = URI.create("/usuarios/" + novoUsuario.getId());
            return ResponseEntity.created(location).body(novoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return service.updateUser(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (service.deleteUser(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // --- MÉTODO DE LOGIN (ATUALIZADO) ---

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            UserResponseDTO userDTO = service.authenticateUser(
                    loginRequest.getEmail(),
                    loginRequest.getSenha()
            );

            User user = new User();
            user.setId(userDTO.getId());
            user.setEmail(userDTO.getEmail());
            user.setNome(userDTO.getNome());

            String token = jwtTokenService.generateToken(user);

            LoginResponseDTO response = new LoginResponseDTO(userDTO, token);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
}