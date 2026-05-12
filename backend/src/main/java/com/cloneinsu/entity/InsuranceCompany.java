package com.cloneinsu.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "insurance_companies")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor(access = AccessLevel.PROTECTED) @Builder
public class InsuranceCompany {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String shortName;

    @Column(nullable = false)
    private String category; // 손해보험, 생명보험, 배상책임

    private String color;

    @Column(nullable = false)
    private Boolean vfax;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (vfax == null) vfax = false;
    }
}
