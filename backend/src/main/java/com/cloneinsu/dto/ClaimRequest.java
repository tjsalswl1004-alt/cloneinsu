package com.cloneinsu.dto;

import com.cloneinsu.entity.ClaimStatus;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter @Setter
public class ClaimRequest {
    // 고객 정보 (customer find-or-create 용)
    private String patientName;
    private String idFront;
    private String idBack;
    private String phone;
    private Boolean sameAsInsured;

    // 보험사
    private Long insuranceCompanyId;

    // 사고/진료 정보
    private String accidentType;
    private LocalDate accidentDate;
    private String accidentDetail;

    // 교통사고 전용
    private Boolean autoInsuranceClaimed;
    private String autoInsuranceCompany;
    private String ownVehicleInsurance;
    private String vehiclePlateNumber;

    // 진료기관
    private String hospitalName;

    // 계좌정보
    private String accountType;
    private String bankName;
    private String accountNumber;
    private String accountHolder;

    // 서명
    private String signMethod;
    private String signatureData;

    // 기타
    private Long amount;
    private ClaimStatus status;
}
