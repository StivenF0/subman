package com.subman.submanapi.service;

import com.subman.submanapi.model.Subscription;
import com.subman.submanapi.repository.SubscriptionRepository;
import com.subman.submanapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    @Autowired
    public SubscriptionService(SubscriptionRepository subscriptionRepository, UserRepository userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    // --- Métodos CRUD Básicos ---

    /**
     * Retorna TODAS as assinaturas que pertencem a um usuário específico.
     * @param userId O ID do usuário logado.
     * @return Uma lista de suas assinaturas.
     */
    public List<Subscription> findAllByUserId(Long userId) {
        // Simplesmente repassa a chamada para o repositório que já faz o filtro
        return subscriptionRepository.findAllByUserId(userId);
    }

    /**
     * Busca uma assinatura específica pelo seu ID, garantindo que ela
     * pertence ao usuário logado.
     * @param id O ID da assinatura.
     * @param userId O ID do usuário logado.
     * @return Um Optional contendo a assinatura (se encontrada e pertencer ao usuário).
     */
    public Optional<Subscription> findById(Long id, Long userId) {
        Optional<Subscription> optionalSub = subscriptionRepository.findById(id);

        if (optionalSub.isPresent()) {
            Subscription sub = optionalSub.get();
            if (sub.getUserId().equals(userId)) {
                return Optional.of(sub);
            }
        }
        return Optional.empty();
    }

    /**
     * Cria uma nova assinatura e a associa ao usuário logado.
     * @param subscription A nova assinatura (sem ID).
     * @param userId O ID do usuário que está a criar.
     * @return A assinatura salva (com ID).
     */
    public Subscription create(Subscription subscription, Long userId) {
        // Valida se o usuário dono desta assinatura realmente existe
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + userId));

        subscription.setUserId(userId);

        // Zera o histórico e o ID para garantir que é uma criação
        subscription.setId(null);
        subscription.setHistoricoPagamentos(new LinkedList<>()); // Inicia o histórico

        return subscriptionRepository.save(subscription);
    }

    /**
     * Atualiza uma assinatura existente, garantindo que ela pertence ao usuário.
     * @param id O ID da assinatura a atualizar.
     * @param updatedDetails Os novos detalhes da assinatura.
     * @param userId O ID do usuário logado.
     * @return Um Optional com a assinatura atualizada.
     */
    public Optional<Subscription> update(Long id, Subscription updatedDetails, Long userId) {
        Optional<Subscription> optionalExisting = findById(id, userId);

        if (optionalExisting.isEmpty()) {
            return Optional.empty(); // Não encontrou ou não tem permissão
        }

        Subscription existing = optionalExisting.get();

        existing.setNome(updatedDetails.getNome());
        existing.setValor(updatedDetails.getValor());
        existing.setCategoria(updatedDetails.getCategoria());
        existing.setCicloCobranca(updatedDetails.getCicloCobranca());
        existing.setVencimento(updatedDetails.getVencimento());

        Subscription saved = subscriptionRepository.save(existing);
        return Optional.of(saved);
    }

    /**
     * Apaga uma assinatura, garantindo que ela pertence ao usuário.
     * @param id O ID da assinatura a apagar.
     * @param userId O ID do usuário logado.
     * @return true se apagou, false se não encontrou (ou não tinha permissão).
     */
    public boolean delete(Long id, Long userId) {
        Optional<Subscription> optionalSub = findById(id, userId);

        if (optionalSub.isPresent()) {
            subscriptionRepository.deleteById(id);
            return true;
        }

        return false;
    }


    // --- Requisitos Acadêmicos ---

    /**
     * 📜 REQUISITO ACADÊMICO: Algoritmo de Busca (Linear)
     * Busca assinaturas pelo nome, usando uma busca linear manual.
     * @param userId O ID do usuário logado.
     * @param nameQuery O texto a ser procurado no nome.
     * @return Lista de assinaturas que dão "match".
     */
    public List<Subscription> searchSubscriptionsByName(Long userId, String nameQuery) {
        List<Subscription> allUserSubs = findAllByUserId(userId);
        List<Subscription> results = new ArrayList<>();
        String queryLower = nameQuery.toLowerCase();

        // REQUISITO: Busca Linear (O(n))
        // Iteramos manualmente por toda a lista (Array/Vetor) de assinaturas
        // do usuário e comparamos o nome de cada uma.
        for (Subscription sub : allUserSubs) {
            if (sub.getNome().toLowerCase().contains(queryLower)) {
                results.add(sub);
            }
        }
        return results;
    }

    /**
     * 📜 REQUISITO ACADÊMICO: Algoritmo de Ordenação
     * Retorna as assinaturas do usuário, ordenadas por um critério.
     * @param userId O ID do usuário logado.
     * @param sortBy O critério ("price", "duedate", "name").
     * @return Uma lista ordenada.
     */
    public List<Subscription> getSortedSubscriptions(Long userId, String sortBy) {
        List<Subscription> userSubscriptions = findAllByUserId(userId);

        // 2. REQUISITO: Ordenação (Collections.sort)
        // Criamos um Comparator com base no critério
        Comparator<Subscription> comparator;

        switch (sortBy.toLowerCase()) {
            case "price":
                // Ordena por "valor", do menor para o maior
                comparator = Comparator.comparing(Subscription::getValor);
                break;
            case "duedate":
                // Ordena por "vencimento", do mais antigo para o mais novo
                comparator = Comparator.comparing(Subscription::getVencimento);
                break;
            case "name":
            default:
                // Padrão: Ordena por "nome", alfabeticamente
                comparator = Comparator.comparing(Subscription::getNome);
                break;
        }

        // 3. Aplica a ordenação na lista (in-place)
        userSubscriptions.sort(comparator);

        return userSubscriptions;
    }

    /**
     * 📜 REQUISITO ACADÊMICO: Fila (Queue)
     * Retorna as assinaturas que vencem nos próximos 30 dias,
     * numa Fila (FIFO) onde a que vence mais cedo está na frente.
     * @param userId O ID do usuário logado.
     * @return Uma Fila (Queue) de assinaturas.
     */
    public Queue<Subscription> getSubscriptionsDueSoon(Long userId) {
        List<Subscription> userSubscriptions = findAllByUserId(userId);
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);

        // 1. Filtramos apenas as que vencem EM BREVE (nos próximos 30 dias)
        // 2. E ordenamos pela data de vencimento (a mais próxima primeiro)
        List<Subscription> dueSoonList = userSubscriptions.stream()
                .filter(sub -> {
                    LocalDate dueDate = sub.getVencimento();
                    // O vencimento está entre "hoje" (inclusive) e "30 dias" (exclusive)
                    return !dueDate.isBefore(today) && dueDate.isBefore(thirtyDaysFromNow);
                })
                .sorted(Comparator.comparing(Subscription::getVencimento))
                .toList();

        // 3. REQUISITO: Fila (Queue)
        // Colocamos os resultados ordenados numa Fila (usando LinkedList,
        // que implementa a interface Queue).
        // O item na "cabeça" da fila (queue.peek()) é o que vence mais cedo.

        return new LinkedList<>(dueSoonList);
    }
}