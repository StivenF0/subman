package com.subman.submanapi.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.subman.submanapi.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class UserRepository {

    private final ObjectMapper objectMapper;
    private final File DATABASE_FILE = new File("data/users.json");
    private final Map<Long, User> database = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    @Autowired
    public UserRepository(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void init() {
        loadDatabase();
        long maxId = database.keySet().stream().max(Long::compareTo).orElse(0L);
        idGenerator.set(maxId);
    }

    @PreDestroy
    public void shutdown() {
        saveDatabase();
    }

    public List<User> findAll() {
        return new ArrayList<>(database.values());
    }

    public Optional<User> findById(Long id) {
        return Optional.ofNullable(database.get(id));
    }

    public Optional<User> findByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        return database.values().stream()
                .filter(usuario -> email.equalsIgnoreCase(usuario.getEmail()))
                .findFirst();
    }

    public User save(User user) {
        if (user.getId() == null || user.getId() == 0) {
            user.setId(idGenerator.incrementAndGet());
        }
        database.put(user.getId(), user);
        saveDatabase();
        return user;
    }

    public void deleteById(Long id) {
        database.remove(id);
        saveDatabase();
    }

    private void loadDatabase() {
        try {
            if (!DATABASE_FILE.exists()) {
                DATABASE_FILE.createNewFile();
                objectMapper.writeValue(DATABASE_FILE, new ArrayList<>());
                return;
            }
            List<User> users = objectMapper.readValue(DATABASE_FILE, new TypeReference<List<User>>() {});
            database.clear();
            for (User u : users) {
                database.put(u.getId(), u);
            }
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível carregar o banco de dados de usuários.", e);
        }
    }

    private synchronized void saveDatabase() {
        try {
            List<User> users = new ArrayList<>(database.values());
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(DATABASE_FILE, users);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível salvar o banco de dados de usuários.", e);
        }
    }
}