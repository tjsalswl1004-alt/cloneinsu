package com.cloneinsu.dto;

import com.cloneinsu.entity.Claim;
import com.cloneinsu.entity.ClaimStatus;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class ClaimResponse {
    private final Long id;
    private final String patientName;
    private final String insuranceCompany;
    private final LocalDate claimDate;
    private final Long amount;
    private final ClaimStatus status;
    private final LocalDateTime createdAt;

    public ClaimResponse(Claim claim) {
        this.id = claim.getId();
        this.patientName = claim.getPatientName();
        this.insuranceCompany = claim.getInsuranceCompany();
        this.claimDate = claim.getClaimDate();
        this.amount = claim.getAmount();
        this.status = claim.getStatus();
        this.createdAt = claim.getCreatedAt();
    }
}
