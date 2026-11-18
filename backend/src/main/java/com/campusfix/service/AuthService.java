package com.campusfix.service;

import com.campusfix.dto.AuthRequest;
import com.campusfix.dto.AuthResponse;
import com.campusfix.dto.RegisterRequest;
import com.campusfix.model.Campus;
import com.campusfix.model.Institution;
import com.campusfix.model.Role;
import com.campusfix.model.User;
import com.campusfix.repository.CampusRepository;
import com.campusfix.repository.InstitutionRepository;
import com.campusfix.repository.UserRepository;
import com.campusfix.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CampusRepository campusRepository;
    private final InstitutionRepository institutionRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse registerStudent(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("Email is already registered: " + request.getEmail());
        }

        Campus campus = null;
        if (request.getCampusId() != null) {
            campus = campusRepository.findById(request.getCampusId()).orElse(null);
        }
        if (campus == null) {
            campus = campusRepository.findAll().stream().findFirst().orElse(null);
        }

        Institution institution = (campus != null) ? campus.getInstitution() : null;
        if (institution == null) {
            institution = institutionRepository.findAll().stream().findFirst().orElse(null);
        }

        // New registrations are strictly STUDENT role (Admins must be seeded)
        User user = User.builder()
                .name(request.getName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .campus(campus)
                .institution(institution)
                .build();

        user = userRepository.save(user);

        // Authenticate new user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .institutionId(institution != null ? institution.getId() : null)
                .institutionName(institution != null ? institution.getName() : null)
                .campusId(campus != null ? campus.getId() : null)
                .campusName(campus != null ? campus.getName() : null)
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .institutionId(user.getInstitution() != null ? user.getInstitution().getId() : null)
                .institutionName(user.getInstitution() != null ? user.getInstitution().getName() : null)
                .campusId(user.getCampus() != null ? user.getCampus().getId() : null)
                .campusName(user.getCampus() != null ? user.getCampus().getName() : null)
                .build();
    }
}
