package com.subman.submanapi.util;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * 📜 CLASSE UTILITÁRIA: Algoritmos de Ordenação
 * Contém implementações manuais de algoritmos de ordenação para fins acadêmicos.
 */
public class SortingAlgorithms {

    /**
     * Implementação do algoritmo Merge Sort.
     * Divide a lista recursivamente e depois mescla ordenadamente.
     * Complexidade: O(n log n)
     *
     * @param list A lista a ser ordenada (será modificada in-place)
     * @param comparator O comparador para definir a ordem
     * @param <T> O tipo dos elementos da lista
     */
    public static <T> void mergeSort(List<T> list, Comparator<T> comparator) {
        if (list == null || list.size() <= 1) {
            return;
        }
        mergeSort(list, comparator, 0, list.size() - 1);
    }

    /**
     * Método auxiliar recursivo do Merge Sort.
     *
     * @param list A lista a ser ordenada
     * @param comparator O comparador para definir a ordem
     * @param left O índice inicial do segmento
     * @param right O índice final do segmento
     * @param <T> O tipo dos elementos da lista
     */
    private static <T> void mergeSort(List<T> list, Comparator<T> comparator, int left, int right) {
        if (left < right) {
            int middle = left + (right - left) / 2;

            // Ordena primeira e segunda metade recursivamente
            mergeSort(list, comparator, left, middle);
            mergeSort(list, comparator, middle + 1, right);

            // Mescla as duas metades ordenadas
            merge(list, comparator, left, middle, right);
        }
    }

    /**
     * Mescla dois sub-arrays ordenados em um único array ordenado.
     * Este é o coração do algoritmo Merge Sort.
     *
     * @param list A lista contendo os sub-arrays
     * @param comparator O comparador para definir a ordem
     * @param left O índice inicial do primeiro sub-array
     * @param middle O índice final do primeiro sub-array
     * @param right O índice final do segundo sub-array
     * @param <T> O tipo dos elementos da lista
     */
    private static <T> void merge(List<T> list, Comparator<T> comparator, int left, int middle, int right) {
        // Calcula os tamanhos dos dois sub-arrays
        int n1 = middle - left + 1;
        int n2 = right - middle;

        // Cria arrays temporários
        List<T> leftArray = new ArrayList<>(n1);
        List<T> rightArray = new ArrayList<>(n2);

        // Copia os dados para os arrays temporários
        for (int i = 0; i < n1; i++) {
            leftArray.add(list.get(left + i));
        }
        for (int j = 0; j < n2; j++) {
            rightArray.add(list.get(middle + 1 + j));
        }

        // Mescla os arrays temporários de volta no array principal
        int i = 0, j = 0;
        int k = left;

        while (i < n1 && j < n2) {
            if (comparator.compare(leftArray.get(i), rightArray.get(j)) <= 0) {
                list.set(k, leftArray.get(i));
                i++;
            } else {
                list.set(k, rightArray.get(j));
                j++;
            }
            k++;
        }

        // Copia os elementos restantes de leftArray, se houver
        while (i < n1) {
            list.set(k, leftArray.get(i));
            i++;
            k++;
        }

        // Copia os elementos restantes de rightArray, se houver
        while (j < n2) {
            list.set(k, rightArray.get(j));
            j++;
            k++;
        }
    }
}

