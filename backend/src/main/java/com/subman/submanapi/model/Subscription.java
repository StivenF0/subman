package com.subman.submanapi.model;

import com.subman.submanapi.enums.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Subscription {
    private Long id;
    private String nome;
    private BigDecimal valor;
    private Category categoria;
    private Date vencimento;
    private User usuario;
    private List<Subscription> historico = new LinkedList<>();
}
