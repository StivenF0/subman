package com.subman.submanapi.service;

import com.subman.submanapi.dto.UserResponseDTO;
import com.subman.submanapi.model.User;
import com.subman.submanapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // --- NOVO IMPORT ---
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Injeção de dependência via construtor (melhor prática)
     */
    @Autowired
    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponseDTO> findAll() {
        List<User> users = repository.findAll();
        return UserResponseDTO.fromEntityList(users);
    }

    public Optional<UserResponseDTO> findById(Long id) {
        return repository.findById(id).map(UserResponseDTO::new);
    }

    public UserResponseDTO createUser(User user) {
        if (repository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Erro: E-mail já cadastrado.");
        }

        String hashedPassword = passwordEncoder.encode(user.getSenha());
        user.setSenha(hashedPassword);

        User newUser = repository.save(user);
        return new UserResponseDTO(newUser);
    }

    public Optional<UserResponseDTO> updateUser(Long id, User userDetails) {
        Optional<User> optionalUsuario = repository.findById(id);

        if (optionalUsuario.isEmpty()) {
            return Optional.empty();
        }

        User userExists = optionalUsuario.get();

        if (userDetails.getNome() != null && !userDetails.getNome().isEmpty()) {
            userExists.setNome(userDetails.getNome());
        }

        if (userDetails.getEmail() != null && !userDetails.getEmail().isEmpty()) {
            userExists.setEmail(userDetails.getEmail());
        }

        if (userDetails.getSenha() != null && !userDetails.getSenha().isEmpty()) {
            userExists.setSenha(
                    passwordEncoder.encode(userDetails.getSenha())
            );
        }

        User uptadedUser = repository.save(userExists);
        return Optional.of(new UserResponseDTO(uptadedUser));
    }

    public boolean deleteUser(Long id) {
        if (repository.findById(id).isEmpty()) {
            return false;
        }
        repository.deleteById(id);
        return true;
    }


    public UserResponseDTO authenticateUser(String email, String senhaPura) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário ou senha inválidos."));

        boolean passwordIsCorrect = passwordEncoder.matches(senhaPura, user.getSenha());

        if (passwordIsCorrect) {
            return new UserResponseDTO(user);
        } else {
            throw new RuntimeException("Usuário ou senha inválidos.");
        }
    }
}