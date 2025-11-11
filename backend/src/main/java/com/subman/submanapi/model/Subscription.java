package com.subman.submanapi.model;

import com.subman.submanapi.enums.BillingCycle;
import com.subman.submanapi.enums.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Subscription {
    private Long id;
    private Long userId;
    private String nome;
    private BigDecimal valor;
    private Category categoria;
    private BillingCycle cicloCobranca;
    private LocalDate vencimento;
    private List<String> historicoPagamentos = new LinkedList<>();
}
