package com.subman.submanapi.controller;

import com.subman.submanapi.model.Subscription;
import com.subman.submanapi.model.User; // Importante
import com.subman.submanapi.service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Importante
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Queue;

/**
 * Controlador para gerir as assinaturas (Subscriptions).
 * * NOTA DE SEGURANÇA:
 * Todos os endpoints aqui são protegidos pelo SecurityConfig.
 * O Spring Security (via JwtAuthFilter) garante que o parâmetro
 * 'Authentication' só estará presente se o usuário enviar um Token JWT válido.
 */
@RestController
@RequestMapping("/api/subscriptions") // O prefixo da API (protegido)
public class SubscriptionController {

    private final SubscriptionService service;

    // Injeção de dependência via construtor
    public SubscriptionController(SubscriptionService service) {
        this.service = service;
    }

    /**
     * Método auxiliar privado para extrair o ID do usuário "logado".
     * O 'Authentication' é injetado automaticamente pelo Spring Security.
     */
    private Long getUserIdFromAuthentication(Authentication authentication) {
        User userPrincipal = (User) authentication.getPrincipal();
        return userPrincipal.getId();
    }


    // --- Endpoints CRUD Básicos (Protegidos) ---

    /**
     * GET /api/subscriptions
     * Retorna todas as assinaturas do usuário logado.
     */
    @GetMapping
    public List<Subscription> getMySubscriptions(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        return service.findAllByUserId(userId);
    }

    /**
     * GET /api/subscriptions/{id}
     * Retorna uma assinatura específica, se pertencer ao usuário logado.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Subscription> findById(
            @PathVariable Long id,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        return service.findById(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/subscriptions
     * Cria uma nova assinatura associada ao usuário logado.
     */
    @PostMapping
    public ResponseEntity<Subscription> create(
            @RequestBody Subscription subscription,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        Subscription newSub = service.create(subscription, userId);

        URI location = URI.create("/api/subscriptions/" + newSub.getId());
        return ResponseEntity.created(location).body(newSub);
    }

    /**
     * PUT /api/subscriptions/{id}
     * Atualiza uma assinatura, se pertencer ao usuário logado.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Subscription> update(
            @PathVariable Long id,
            @RequestBody Subscription subscriptionDetails,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        return service.update(id, subscriptionDetails, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/subscriptions/{id}
     * Apaga uma assinatura, se pertencer ao usuário logado.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        if (service.delete(id, userId)) {
            return ResponseEntity.noContent().build(); // 204
        } else {
            return ResponseEntity.notFound().build(); // 404
        }
    }


    // --- Endpoints dos Requisitos Acadêmicos (Protegidos) ---

    /**
     * 📜 REQUISITO: Busca (Linear)
     * GET /api/subscriptions/search?name=net
     */
    @GetMapping("/search")
    public List<Subscription> searchByName(
            @RequestParam("name") String query,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        return service.searchSubscriptionsByName(userId, query);
    }

    /**
     * 📜 REQUISITO: Ordenação
     * GET /api/subscriptions/sorted?by=price
     */
    @GetMapping("/sorted")
    public List<Subscription> getSorted(
            @RequestParam("by") String sortBy,
            Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        return service.getSortedSubscriptions(userId, sortBy);
    }

    /**
     * 📜 REQUISITO: Fila (Queue)
     * GET /api/subscriptions/due-soon
     */
    @GetMapping("/due-soon")
    public Queue<Subscription> getDueSoon(Authentication authentication) {

        Long userId = getUserIdFromAuthentication(authentication);
        return service.getSubscriptionsDueSoon(userId);
    }
}