package com.campusfix;

import com.campusfix.dto.AuthRequest;
import com.campusfix.dto.AuthResponse;
import com.campusfix.dto.RegisterRequest;
import com.campusfix.model.Role;
import com.campusfix.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AuthServiceTests {

    @Autowired
    private AuthService authService;

    @Test
    @DisplayName("Should successfully register a new student")
    void testRegisterStudentSuccess() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Kavya N")
                .email("kavya.n@nie.ac.in")
                .password("Password@123")
                .build();

        AuthResponse response = authService.registerStudent(request);

        assertNotNull(response.getToken());
        assertEquals("kavya.n@nie.ac.in", response.getEmail());
        assertEquals(Role.STUDENT, response.getRole());
    }

    @Test
    @DisplayName("Should reject duplicate student registration with existing email")
    void testRegisterDuplicateEmail() {
        RegisterRequest request1 = RegisterRequest.builder()
                .name("Student One")
                .email("student.dup@nie.ac.in")
                .password("Password@123")
                .build();
        authService.registerStudent(request1);

        RegisterRequest request2 = RegisterRequest.builder()
                .name("Student Two")
                .email("student.dup@nie.ac.in")
                .password("DifferentPassword@123")
                .build();

        assertThrows(IllegalArgumentException.class, () -> authService.registerStudent(request2));
    }

    @Test
    @DisplayName("Should successfully authenticate seeded admin account")
    void testAdminLoginSuccess() {
        AuthRequest request = AuthRequest.builder()
                .email("admin@nie.ac.in")
                .password("Admin@NIE2026")
                .build();

        AuthResponse response = authService.login(request);

        assertNotNull(response.getToken());
        assertEquals(Role.ADMIN, response.getRole());
    }

    @Test
    @DisplayName("Should reject login with invalid credentials")
    void testInvalidCredentialsLogin() {
        AuthRequest request = AuthRequest.builder()
                .email("admin@nie.ac.in")
                .password("WrongPassword123")
                .build();

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }
}
