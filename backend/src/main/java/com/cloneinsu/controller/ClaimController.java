package com.cloneinsu.controller;

import com.cloneinsu.dto.ClaimRequest;
import com.cloneinsu.dto.ClaimResponse;
import com.cloneinsu.dto.ClaimStatsResponse;
import com.cloneinsu.entity.ClaimStatus;
import com.cloneinsu.service.ClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @GetMapping
    public List<ClaimResponse> getClaims(
        @RequestParam(required = false) ClaimStatus status
    ) {
        return claimService.getClaims(status);
    }

    @GetMapping("/stats")
    public ClaimStatsResponse getStats() {
        return claimService.getStats();
    }

    @GetMapping("/{id}")
    public ClaimResponse getClaim(@PathVariable Long id) {
        return claimService.getClaim(id);
    }

    @PostMapping
    public ResponseEntity<ClaimResponse> createClaim(@RequestBody ClaimRequest request) {
        return ResponseEntity.ok(claimService.createClaim(request));
    }

    @PutMapping("/{id}")
    public ClaimResponse updateClaim(@PathVariable Long id, @RequestBody ClaimRequest request) {
        return claimService.updateClaim(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClaim(@PathVariable Long id) {
        claimService.deleteClaim(id);
        return ResponseEntity.noContent().build();
    }
}
