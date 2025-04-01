package com.eshop.Eshop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Boolean isActive;

    @Column(length = 255)
    private String name;

    @Column(columnDefinition = "TEXT", length = 500)
    private String description;
    private Double prices;

    // 1 = 100%, final amount = amount - amount * discount, display discount = discount * 100
    private Double discount;
    private Integer stock;

    @ElementCollection
    @CollectionTable(name = "product_image_urls",
            joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private List<String> imageUrls = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_video_urls", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "video_url", columnDefinition = "TEXT")
    private List<String> videoUrls = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String tableData;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "product_keyword",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "keyword_id")
    )
    @JsonIgnore
    private Set<Keyword> keywords = new HashSet<>();


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "product_category",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    @JsonIgnore
    private Set<Category> categories = new HashSet<>();



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "store_id")
    @JsonIgnore
    private Store store;

    private Double length;
    private Double width;
    private Double height;
    private Double weight;

    @Column(length = 255)
    private String material;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
