package com.cloneinsu;

import com.cloneinsu.service.InsuranceCompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final InsuranceCompanyService insuranceCompanyService;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        insuranceCompanyService.seedIfEmpty();
    }
}
