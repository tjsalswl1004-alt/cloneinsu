package com.cloneinsu.controller;

import com.cloneinsu.dto.CustomerResponse;
import com.cloneinsu.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;

    @GetMapping
    public List<CustomerResponse> getAll() {
        return customerRepository.findAll().stream().map(CustomerResponse::new).toList();
    }
}
