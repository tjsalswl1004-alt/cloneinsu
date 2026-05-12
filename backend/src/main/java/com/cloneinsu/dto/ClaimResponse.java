package com.cloneinsu.dto;

import com.cloneinsu.entity.Claim;
import com.cloneinsu.entity.ClaimStatus;
import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class ClaimResponse {
    private final Long id;
    private final CustomerResponse customer;
    private final InsuranceCompanyResponse insuranceCompany;
    private final Boolean sameAsInsured;
    private final String accidentType;
    private final LocalDate accidentDate;
    private final String accidentDetail;
    private final Boolean autoInsuranceClaimed;
    private final String autoInsuranceCompany;
    private final String ownVehicleInsurance;
    private final String vehiclePlateNumber;
    private final String hospitalName;
    private final AccountInfo account;
    private final SignatureInfo signature;
    private final int attachmentCount;
    private final Long amount;
    private final ClaimStatus status;
    private final LocalDateTime createdAt;

    @Getter
    public static class AccountInfo {
        private final String accountType;
        private final String bankName;
        private final String accountNumber;
        private final String accountHolder;

        public AccountInfo(com.cloneinsu.entity.ClaimAccount a) {
            this.accountType = a.getAccountType();
            this.bankName = a.getBankName();
            this.accountNumber = a.getAccountNumber();
            this.accountHolder = a.getAccountHolder();
        }
    }

    @Getter
    public static class SignatureInfo {
        private final String signMethod;
        private final String signatureData;

        public SignatureInfo(com.cloneinsu.entity.ClaimSignature s) {
            this.signMethod = s.getSignMethod();
            this.signatureData = s.getSignatureData();
        }
    }

    public ClaimResponse(Claim c) {
        this.id = c.getId();
        this.customer = c.getCustomer() != null ? new CustomerResponse(c.getCustomer()) : null;
        this.insuranceCompany = c.getInsuranceCompany() != null ? new InsuranceCompanyResponse(c.getInsuranceCompany()) : null;
        this.sameAsInsured = c.getSameAsInsured();
        this.accidentType = c.getAccidentType();
        this.accidentDate = c.getAccidentDate();
        this.accidentDetail = c.getAccidentDetail();
        this.autoInsuranceClaimed = c.getAutoInsuranceClaimed();
        this.autoInsuranceCompany = c.getAutoInsuranceCompany();
        this.ownVehicleInsurance = c.getOwnVehicleInsurance();
        this.vehiclePlateNumber = c.getVehiclePlateNumber();
        this.hospitalName = c.getHospitalName();
        this.account = c.getAccount() != null ? new AccountInfo(c.getAccount()) : null;
        this.signature = c.getSignature() != null ? new SignatureInfo(c.getSignature()) : null;
        this.attachmentCount = c.getAttachments() != null ? c.getAttachments().size() : 0;
        this.amount = c.getAmount();
        this.status = c.getStatus();
        this.createdAt = c.getCreatedAt();
    }
}
