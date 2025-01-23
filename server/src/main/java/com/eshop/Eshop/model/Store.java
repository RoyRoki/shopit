package com.eshop.Eshop.model;

import com.eshop.Eshop.model.enums.PaymentType;
import com.eshop.Eshop.model.enums.ShippingType;
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
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    private String name;
    private String email;
    private String mobileNo;
    private String description;
    private Boolean isActive;


    private String houseNo;
    private String street;
    private String city;
    private String state;
    private String pinCode;
    private String landmark;

    private String logoUrl;
    private String bannerUrl;
    private String header;
    private String about;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "store_category",
            joinColumns = @JoinColumn(name = "store_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    @JsonIgnore
    private Set<Category> categories = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "store", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Product> products = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ShippingType shippingType;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "store_payment_types", joinColumns = @JoinColumn(name = "store_id"))
    @Enumerated(EnumType.STRING)
    private Set<PaymentType> paymentTypes;

    @OneToMany(mappedBy = "store", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderPerStore> orderPerStores;
}
