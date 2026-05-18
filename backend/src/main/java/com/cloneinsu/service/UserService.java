package com.cloneinsu.service;

import com.cloneinsu.dto.LoginRequest;
import com.cloneinsu.dto.LoginResponse;
import com.cloneinsu.dto.SignupRequest;
import com.cloneinsu.dto.SignupResponse;
import com.cloneinsu.entity.User;
import com.cloneinsu.entity.UserRole;
import com.cloneinsu.exception.DuplicateEmailException;
import com.cloneinsu.exception.InvalidCredentialsException;
import com.cloneinsu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return new LoginResponse(user);
    }

    @Transactional
    public SignupResponse signup(SignupRequest request) {
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException(request.getEmail());
        }

        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .phone(request.getPhone())
            .company(request.getCompany())
            .role(UserRole.UNAUTHENTICATED)
            .verified(false)
            .build();

        User saved = userRepository.save(user);
        return new SignupResponse(saved);
    }
}
