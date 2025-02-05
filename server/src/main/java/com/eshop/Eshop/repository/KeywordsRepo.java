package com.eshop.Eshop.repository;

import com.eshop.Eshop.model.Keyword;
import com.eshop.Eshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface KeywordsRepo extends JpaRepository<Keyword, Long> {

    @Query("SELECT k FROM Keyword k WHERE LOWER(k.word) = LOWER(:word)")
    Optional<Keyword> findByWordIgnoreCase(@Param("word") String word);

    Keyword findByWordContaining(String id);

    // @Query(value = "SELECT * FROM keywords WHERE LOWER(word) IN :words", nativeQuery = true)
    @Query(value = "SELECT * FROM keywords WHERE LOWER(word) = ANY(:words)", nativeQuery = true)
    List<Keyword> findAllByWordIgnoreCaseIn(@Param("words") Set<String> words);
}   
