package com.cloneinsu.dto;

import com.cloneinsu.entity.Customer;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class CustomerResponse {
    private final Long id;
    private final String name;
    private final String idFront;
    private final String phone;
    private final LocalDateTime createdAt;

    public CustomerResponse(Customer c) {
        this.id = c.getId();
        this.name = c.getName();
        this.idFront = c.getIdFront();
        this.phone = c.getPhone();
        this.createdAt = c.getCreatedAt();
    }
}
