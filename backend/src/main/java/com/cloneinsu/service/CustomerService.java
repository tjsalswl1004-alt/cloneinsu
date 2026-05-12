package com.cloneinsu.service;

import com.cloneinsu.entity.Customer;
import com.cloneinsu.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public Customer findOrCreate(String name, String idFront, String idBack, String phone) {
        // 주민번호 앞자리+뒷자리로 고유 식별
        if (idFront != null && idBack != null) {
            return customerRepository.findByIdFrontAndIdBack(idFront, idBack)
                .map(c -> {
                    c.setName(name);
                    c.setPhone(phone);
                    return customerRepository.save(c);
                })
                .orElseGet(() -> customerRepository.save(Customer.builder()
                    .name(name).idFront(idFront).idBack(idBack).phone(phone).build()));
        }
        // 주민번호 앞자리+이름으로 차선 식별
        if (idFront != null && name != null) {
            return customerRepository.findByNameAndIdFront(name, idFront)
                .orElseGet(() -> customerRepository.save(Customer.builder()
                    .name(name).idFront(idFront).phone(phone).build()));
        }
        // 최소한 이름으로 생성
        return customerRepository.save(Customer.builder()
            .name(name != null ? name : "미입력").phone(phone).build());
    }
}
