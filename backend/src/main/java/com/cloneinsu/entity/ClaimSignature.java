package com.cloneinsu.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "claim_signatures")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor(access = AccessLevel.PROTECTED) @Builder
public class ClaimSignature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false, unique = true)
    private Claim claim;

    private String signMethod;

    @Column(columnDefinition = "TEXT")
    private String signatureData;
}
