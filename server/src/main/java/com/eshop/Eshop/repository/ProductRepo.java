package com.eshop.Eshop.repository;

import com.eshop.Eshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    List<Product> findByCategories_IdAndIsActiveTrue(Long categoryId);

    List<Product> findByKeywords_WordAndIsActiveTrue(String word);

    List<Product> findByStore_IdAndIsActiveTrue(Long id);

    boolean existsByIdAndStoreId(Long productId, Long storeId);

    List<Product> findByStore_Id(Long storeId);

    @Query(value = """
    WITH aggregated_data AS (
        SELECT p.id AS product_id,
               to_tsvector('english',
                   COALESCE(p.name, '') || ' ' ||
                   COALESCE(p.description, '') || ' ' ||
                   string_agg(COALESCE(k.word, ''), ' ')
               ) AS document
        FROM product p
        LEFT JOIN product_keywords pk ON p.id = pk.product_id
        LEFT JOIN keyword k ON pk.keyword_id = k.id
        WHERE p.is_active = true
        GROUP BY p.id
    )
    SELECT p.*
    FROM product p
    JOIN aggregated_data ad ON p.id = ad.product_id
    WHERE ad.document @@ websearch_to_tsquery('english', :query)
    ORDER BY ts_rank(ad.document, websearch_to_tsquery('english', :query)) DESC;
    """, nativeQuery = true)
    List<Product> findProductBySearch(@Param("query") String query);


}
