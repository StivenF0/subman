package com.subman.submanapi.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.subman.submanapi.model.Subscription;
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
import java.util.stream.Collectors;

@Repository
public class SubscriptionRepository {

    private final ObjectMapper objectMapper;
    private final File DATABASE_FILE = new File("data/subscriptions.json");

    private final Map<Long, Subscription> database = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    @Autowired
    public SubscriptionRepository(ObjectMapper objectMapper) {
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

    // --- Métodos de CRUD ---

    public List<Subscription> findAll() {
        return new ArrayList<>(database.values());
    }

    public Optional<Subscription> findById(Long id) {
        return Optional.ofNullable(database.get(id));
    }

    public Subscription save(Subscription subscription) {
        if (subscription.getId() == null || subscription.getId() == 0) {
            subscription.setId(idGenerator.incrementAndGet());
        }
        database.put(subscription.getId(), subscription);
        saveDatabase(); // Salva a cada alteração
        return subscription;
    }

    public void deleteById(Long id) {
        database.remove(id);
        saveDatabase();
    }

    // --- Métodos de Busca Personalizados ---

    /**
     * Requisito Chave: Encontrar todas as assinaturas que pertencem a um usuário específico.
     * Esta é a nossa "busca por chave estrangeira" manual.
     */
    public List<Subscription> findAllByUserId(Long userId) {
        if (userId == null) {
            return new ArrayList<>(); // Retorna lista vazia se o ID for nulo
        }

        return database.values().stream()
                .filter(subscription -> userId.equals(subscription.getUserId()))
                .collect(Collectors.toList());
    }


    // --- Métodos de Persistencia ---

    private void loadDatabase() {
        try {
            if (!DATABASE_FILE.exists()) {
                DATABASE_FILE.getParentFile().mkdirs();
                DATABASE_FILE.createNewFile();
                objectMapper.writeValue(DATABASE_FILE, new ArrayList<>());
                return;
            }
            List<Subscription> subscriptions = objectMapper.readValue(DATABASE_FILE, new TypeReference<List<Subscription>>() {});
            database.clear();
            for (Subscription s : subscriptions) {
                database.put(s.getId(), s);
            }
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível carregar o banco de dados de assinaturas.", e);
        }
    }

    private synchronized void saveDatabase() {
        try {
            List<Subscription> subscriptions = new ArrayList<>(database.values());
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(DATABASE_FILE, subscriptions);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível salvar o banco de dados de assinaturas.", e);
        }
    }
}