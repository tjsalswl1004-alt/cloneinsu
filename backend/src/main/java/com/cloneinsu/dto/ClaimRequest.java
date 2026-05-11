package com.cloneinsu.dto;

import com.cloneinsu.entity.ClaimStatus;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class ClaimRequest {
    private String patientName;
    private String insuranceCompany;
    private LocalDate claimDate;
    private Long amount;
    private ClaimStatus status;
}
