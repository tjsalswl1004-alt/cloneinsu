package com.cloneinsu.repository;

import com.cloneinsu.entity.ClaimAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClaimAccountRepository extends JpaRepository<ClaimAccount, Long> {
    Optional<ClaimAccount> findByClaimId(Long claimId);
}
