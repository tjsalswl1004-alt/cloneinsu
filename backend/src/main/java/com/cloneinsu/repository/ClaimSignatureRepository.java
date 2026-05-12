package com.cloneinsu.repository;

import com.cloneinsu.entity.ClaimSignature;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClaimSignatureRepository extends JpaRepository<ClaimSignature, Long> {
    Optional<ClaimSignature> findByClaimId(Long claimId);
}
