package com.cloneinsu.service;

import com.cloneinsu.dto.ClaimRequest;
import com.cloneinsu.dto.ClaimResponse;
import com.cloneinsu.dto.ClaimStatsResponse;
import com.cloneinsu.entity.Claim;
import com.cloneinsu.entity.ClaimStatus;
import com.cloneinsu.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;

    public List<ClaimResponse> getClaims(ClaimStatus status) {
        List<Claim> claims = status != null
            ? claimRepository.findByStatusOrderByCreatedAtDesc(status)
            : claimRepository.findAllByOrderByCreatedAtDesc();
        return claims.stream().map(ClaimResponse::new).toList();
    }

    public ClaimResponse getClaim(Long id) {
        Claim claim = claimRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Claim not found: " + id));
        return new ClaimResponse(claim);
    }

    public ClaimResponse createClaim(ClaimRequest request) {
        Claim claim = Claim.builder()
            .patientName(request.getPatientName())
            .insuranceCompany(request.getInsuranceCompany())
            .claimDate(request.getClaimDate())
            .amount(request.getAmount())
            .status(request.getStatus() != null ? request.getStatus() : ClaimStatus.DRAFT)
            .build();
        return new ClaimResponse(claimRepository.save(claim));
    }

    public ClaimResponse updateClaim(Long id, ClaimRequest request) {
        Claim claim = claimRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Claim not found: " + id));
        claim.setPatientName(request.getPatientName());
        claim.setInsuranceCompany(request.getInsuranceCompany());
        claim.setClaimDate(request.getClaimDate());
        claim.setAmount(request.getAmount());
        if (request.getStatus() != null) claim.setStatus(request.getStatus());
        return new ClaimResponse(claimRepository.save(claim));
    }

    public void deleteClaim(Long id) {
        claimRepository.deleteById(id);
    }

    public ClaimStatsResponse getStats() {
        List<Claim> all = claimRepository.findAllByOrderByCreatedAtDesc();
        long totalAmount = all.stream().mapToLong(c -> c.getAmount() != null ? c.getAmount() : 0).sum();
        long total = all.size();
        long sent = claimRepository.countByStatus(ClaimStatus.SENT);
        long paid = claimRepository.countByStatus(ClaimStatus.PAID);
        int completionRate = total == 0 ? 0 : (int) ((sent * 100) / total);
        return new ClaimStatsResponse(totalAmount, total, sent, paid, completionRate);
    }
}
