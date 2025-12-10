package com.example.helpdesk.service;

import com.example.helpdesk.domain.*;
import com.example.helpdesk.dto.CreateUserDto;
import com.example.helpdesk.dto.UserDto;
import com.example.helpdesk.repository.*;
import com.example.helpdesk.config.AuditUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final ProjectRepository projectRepository;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditUserProvider auditUserProvider;

    public UserDto create(CreateUserDto dto) {
        // Validate password is provided for new user creation
        if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
            throw new RuntimeException("Password is required for creating a new user");
        }

        // Validate username uniqueness
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Validate email uniqueness if provided
        if (dto.getEmail() != null && !dto.getEmail().isEmpty() && userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Fetch related entities
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Project project = null;
        if (dto.getProjectId() != null) {
            project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
        }

        // Create user
        User user = new User();
        user.setName(dto.getName());
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setCompany(company);
        user.setProject(project);
        user.setDepartment(department);
        user.setRole(role);
        user.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        user.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        user.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        user.setCreatedTime(Instant.now());

        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    public Page<UserDto> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToDto);
    }

    public Page<UserDto> findAllActive(Pageable pageable) {
        return userRepository.findByIsActiveTrue(pageable).map(this::mapToDto);
    }

    public Page<UserDto> findAll(String name, Boolean isActive, Pageable pageable) {
        if (name != null && !name.isEmpty()) {
            if (isActive == null || isActive) {
                return userRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name, pageable).map(this::mapToDto);
            } else {
                return userRepository.findAll(pageable).map(this::mapToDto);
            }
        } else {
            if (isActive == null || isActive) {
                return userRepository.findByIsActiveTrue(pageable).map(this::mapToDto);
            } else {
                return userRepository.findAll(pageable).map(this::mapToDto);
            }
        }
    }

    public Optional<UserDto> findById(Long id) {
        return userRepository.findById(id).map(this::mapToDto);
    }

    public Optional<UserDto> findByUsername(String username) {
        return userRepository.findByUsername(username).map(this::mapToDto);
    }

    public Page<UserDto> findByCompanyId(Long companyId, Pageable pageable) {
        return userRepository.findByCompanyIdAndIsActiveTrue(companyId, pageable).map(this::mapToDto);
    }

    public Page<UserDto> findByProjectId(Long projectId, Pageable pageable) {
        return userRepository.findByProjectIdAndIsActiveTrue(projectId, pageable).map(this::mapToDto);
    }

    public Page<UserDto> findByDepartmentId(Long departmentId, Pageable pageable) {
        return userRepository.findByDepartmentIdAndIsActiveTrue(departmentId, pageable).map(this::mapToDto);
    }

    public Page<UserDto> findByRoleId(Long roleId, Pageable pageable) {
        return userRepository.findByRoleIdAndIsActiveTrue(roleId, pageable).map(this::mapToDto);
    }

    public UserDto update(Long id, CreateUserDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update basic fields
        user.setName(dto.getName());
        user.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        user.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        // Update password only if provided (for updates, password can be optional)
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        // Update email if provided
        if (dto.getEmail() != null) {
            // Check if email is being changed to a new value that already exists
            if (!dto.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(dto.getEmail());
        }

        // Update company
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));
        user.setCompany(company);

        // Update project (optional)
        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            user.setProject(project);
        } else {
            user.setProject(null);
        }

        // Update department
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));
        user.setDepartment(department);

        // Update role
        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRole(role);

        user.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        user.setUpdatedTime(Instant.now());

        User updated = userRepository.save(user);
        return mapToDto(updated);
    }

    public UserDto activate(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(true);
        user.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        user.setUpdatedTime(Instant.now());
        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    public UserDto deactivate(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsActive(false);
        user.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        user.setUpdatedTime(Instant.now());
        User saved = userRepository.save(user);
        return mapToDto(saved);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());

        // Company
        if (user.getCompany() != null) {
            dto.setCompanyId(user.getCompany().getId());
            dto.setCompanyName(user.getCompany().getName());
        }

        // Project
        if (user.getProject() != null) {
            dto.setProjectId(user.getProject().getId());
            dto.setProjectName(user.getProject().getName());
        }

        // Department
        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
            dto.setDepartmentName(user.getDepartment().getName());
        }

        // Role
        if (user.getRole() != null) {
            dto.setRoleId(user.getRole().getId());
            dto.setRoleName(user.getRole().getName());
        }

        dto.setCreatedUserId(user.getCreatedUserId());
        dto.setCreatedTime(user.getCreatedTime());
        dto.setUpdatedByUserId(user.getUpdatedByUserId());
        dto.setUpdatedTime(user.getUpdatedTime());
        dto.setSortOrder(user.getSortOrder());
        dto.setIsActive(user.getIsActive());

        return dto;
    }
}

