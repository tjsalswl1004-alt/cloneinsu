package com.cloneinsu.repository;

import com.cloneinsu.entity.InsuranceCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InsuranceCompanyRepository extends JpaRepository<InsuranceCompany, Long> {
    List<InsuranceCompany> findByCategoryOrderByName(String category);
    boolean existsByName(String name);
}
