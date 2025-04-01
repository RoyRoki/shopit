package com.eshop.Eshop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String houseNo;
    private String street;
    private String city;
    private String state;
    private String pinCode;
    private String landmark;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    private User user;
}
