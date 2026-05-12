package com.cloneinsu.repository;

import com.cloneinsu.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByIdFrontAndIdBack(String idFront, String idBack);
    Optional<Customer> findByNameAndIdFront(String name, String idFront);
}
