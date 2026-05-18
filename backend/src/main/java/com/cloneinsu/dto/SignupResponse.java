package com.cloneinsu.dto;

import com.cloneinsu.entity.User;
import lombok.Getter;

@Getter
public class SignupResponse {

    private final Long id;
    private final String email;
    private final String name;
    private final String role;

    public SignupResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.role = user.getRole().name();
    }
}
