package com.cloneinsu.service;

import com.cloneinsu.dto.ClaimRequest;
import com.cloneinsu.dto.ClaimResponse;
import com.cloneinsu.dto.ClaimStatsResponse;
import com.cloneinsu.entity.*;
import com.cloneinsu.repository.ClaimRepository;
import com.cloneinsu.repository.InsuranceCompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final CustomerService customerService;
    private final InsuranceCompanyRepository insuranceCompanyRepository;

    public List<ClaimResponse> getClaims(ClaimStatus status) {
        List<Claim> claims = status != null
            ? claimRepository.findByStatusOrderByCreatedAtDesc(status)
            : claimRepository.findAllByOrderByCreatedAtDesc();
        return claims.stream().map(ClaimResponse::new).toList();
    }

    public ClaimResponse getClaim(Long id) {
        return new ClaimResponse(findClaim(id));
    }

    @Transactional
    public ClaimResponse createClaim(ClaimRequest req) {
        Customer customer = customerService.findOrCreate(
            req.getPatientName(), req.getIdFront(), req.getIdBack(), req.getPhone());

        InsuranceCompany company = req.getInsuranceCompanyId() != null
            ? insuranceCompanyRepository.findById(req.getInsuranceCompanyId()).orElse(null)
            : null;

        Claim claim = Claim.builder()
            .customer(customer)
            .insuranceCompany(company)
            .sameAsInsured(req.getSameAsInsured())
            .accidentType(req.getAccidentType())
            .accidentDate(req.getAccidentDate())
            .accidentDetail(req.getAccidentDetail())
            .autoInsuranceClaimed(req.getAutoInsuranceClaimed())
            .autoInsuranceCompany(req.getAutoInsuranceCompany())
            .ownVehicleInsurance(req.getOwnVehicleInsurance())
            .vehiclePlateNumber(req.getVehiclePlateNumber())
            .hospitalName(req.getHospitalName())
            .amount(req.getAmount())
            .status(req.getStatus() != null ? req.getStatus() : ClaimStatus.DRAFT)
            .build();

        claimRepository.save(claim);
        applyAccountAndSignature(claim, req);
        return new ClaimResponse(claimRepository.save(claim));
    }

    @Transactional
    public ClaimResponse updateClaim(Long id, ClaimRequest req) {
        Claim claim = findClaim(id);

        Customer customer = customerService.findOrCreate(
            req.getPatientName(), req.getIdFront(), req.getIdBack(), req.getPhone());

        InsuranceCompany company = req.getInsuranceCompanyId() != null
            ? insuranceCompanyRepository.findById(req.getInsuranceCompanyId()).orElse(claim.getInsuranceCompany())
            : claim.getInsuranceCompany();

        claim.setCustomer(customer);
        claim.setInsuranceCompany(company);
        claim.setSameAsInsured(req.getSameAsInsured());
        claim.setAccidentType(req.getAccidentType());
        claim.setAccidentDate(req.getAccidentDate());
        claim.setAccidentDetail(req.getAccidentDetail());
        claim.setAutoInsuranceClaimed(req.getAutoInsuranceClaimed());
        claim.setAutoInsuranceCompany(req.getAutoInsuranceCompany());
        claim.setOwnVehicleInsurance(req.getOwnVehicleInsurance());
        claim.setVehiclePlateNumber(req.getVehiclePlateNumber());
        claim.setHospitalName(req.getHospitalName());
        claim.setAmount(req.getAmount());
        if (req.getStatus() != null) claim.setStatus(req.getStatus());

        applyAccountAndSignature(claim, req);
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

    private Claim findClaim(Long id) {
        return claimRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Claim not found: " + id));
    }

    private void applyAccountAndSignature(Claim claim, ClaimRequest req) {
        if (req.getAccountType() != null) {
            ClaimAccount account = claim.getAccount() != null
                ? claim.getAccount()
                : ClaimAccount.builder().claim(claim).build();
            account.setAccountType(req.getAccountType());
            account.setBankName(req.getBankName());
            account.setAccountNumber(req.getAccountNumber());
            account.setAccountHolder(req.getAccountHolder());
            claim.setAccount(account);
        }

        if (req.getSignMethod() != null) {
            ClaimSignature sig = claim.getSignature() != null
                ? claim.getSignature()
                : ClaimSignature.builder().claim(claim).build();
            sig.setSignMethod(req.getSignMethod());
            sig.setSignatureData(req.getSignatureData());
            claim.setSignature(sig);
        }
    }
}
