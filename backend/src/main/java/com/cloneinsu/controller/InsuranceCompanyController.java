package com.cloneinsu.controller;

import com.cloneinsu.dto.InsuranceCompanyResponse;
import com.cloneinsu.service.InsuranceCompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/insurance-companies")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RequiredArgsConstructor
public class InsuranceCompanyController {

    private final InsuranceCompanyService service;

    @GetMapping
    public List<InsuranceCompanyResponse> getAll(
            @RequestParam(required = false) String category) {
        return category != null ? service.getByCategory(category) : service.getAll();
    }
}
