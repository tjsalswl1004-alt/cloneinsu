package com.cloneinsu.repository;

import com.cloneinsu.entity.Claim;
import com.cloneinsu.entity.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByStatusOrderByCreatedAtDesc(ClaimStatus status);
    List<Claim> findAllByOrderByCreatedAtDesc();
    long countByStatus(ClaimStatus status);
}
