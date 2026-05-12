package com.cloneinsu.dto;

import com.cloneinsu.entity.InsuranceCompany;
import lombok.Getter;

@Getter
public class InsuranceCompanyResponse {
    private final Long id;
    private final String name;
    private final String shortName;
    private final String category;
    private final String color;
    private final Boolean vfax;

    public InsuranceCompanyResponse(InsuranceCompany c) {
        this.id = c.getId();
        this.name = c.getName();
        this.shortName = c.getShortName();
        this.category = c.getCategory();
        this.color = c.getColor();
        this.vfax = c.getVfax();
    }
}
