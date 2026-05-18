package com.cloneinsu.dto;

import com.cloneinsu.entity.User;
import lombok.Getter;

@Getter
public class LoginResponse {

    private final Long id;
    private final String email;
    private final String name;
    private final String role;
    private final boolean verified;

    public LoginResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.role = user.getRole().name();
        this.verified = user.isVerified();
    }
}
