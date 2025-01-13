package com.eshop.Eshop.repository;

import com.eshop.Eshop.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepo extends JpaRepository<Store, Long> {
    Optional<Store> findByOwnerId(Long userId);
    List<Store> findByCategories_Id(Long category_id);

    @Query(value = """
    WITH aggregated_data AS (
        SELECT s.id AS store_id,
               to_tsvector('english',
                   COALESCE(s.name, '') || ' ' ||
                   COALESCE(s.description, '') || ' ' ||
                   COALESCE(s.about, '') || ' ' ||
                   array_to_string(array_agg(COALESCE(c.name, '')), ' ')
               ) AS document
        FROM store s
        LEFT JOIN store_category sc ON s.id = sc.store_id
        LEFT JOIN category c ON sc.category_id = c.id
        WHERE s.is_active = true
        GROUP BY s.id
    )
    SELECT s.*
    FROM store s
    JOIN aggregated_data ad ON s.id = ad.store_id
    WHERE ad.document @@ websearch_to_tsquery('english', :query)
    ORDER BY ts_rank(ad.document, websearch_to_tsquery('english', :query)) DESC;
    """, nativeQuery = true)
    List<Store> findStoreBySearch(@Param("query") String query);

}
