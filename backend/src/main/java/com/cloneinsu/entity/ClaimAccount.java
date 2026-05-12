package com.cloneinsu.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "claim_accounts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor(access = AccessLevel.PROTECTED) @Builder
public class ClaimAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false, unique = true)
    private Claim claim;

    private String accountType;
    private String bankName;
    private String accountNumber;
    private String accountHolder;
}
