package com.example.helpdesk.config;

import com.example.helpdesk.domain.*;
import com.example.helpdesk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Database Initializer - Creates initial test data
 *
 * Purpose: Creates default users with different roles for testing
 *
 * What it creates:
 * 1. SYSTEM role (ID=1) - for system operations
 * 2. ADMIN role (ID=2) - for admin users
 * 3. USER role (ID=3) - for regular users
 * 4. VIEWER role (ID=4) - for read-only users
 * 5. Default company and department
 * 6. Test users for each role
 *
 * Test Users Created:
 * - system / system123 (SYSTEM role)
 * - admin / admin123 (ADMIN role)
 * - user / user123 (USER role)
 * - viewer / viewer123 (VIEWER role)
 */
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initDatabase() {
        return args -> {
            // Only initialize if no roles exist
            if (roleRepository.count() == 0) {
                System.out.println("🚀 Initializing database with test data...");

                // Create SYSTEM Role first
                Role systemRole = new Role();
                systemRole.setName("SYSTEM");
                systemRole.setSortOrder(1);
                systemRole.setIsActive(true);
                systemRole.setCreatedUserId(1L); // Self-referential for system
                systemRole = roleRepository.save(systemRole);

                // Create Company
                Company company = new Company();
                company.setName("Default Company");
                company.setSortOrder(1);
                company.setIsActive(true);
                company.setCreatedUserId(1L); // System user
                company = companyRepository.save(company);

                // Create Department
                Department department = new Department();
                department.setName("IT Department");
                department.setSortOrder(1);
                department.setIsActive(true);
                department.setCreatedUserId(1L); // System user
                department = departmentRepository.save(department);

                // Create System User
                User systemUser = new User();
                systemUser.setName("system"); // Set name from BaseAuditable
                systemUser.setUsername("system");
                systemUser.setPassword(passwordEncoder.encode("system123"));
                systemUser.setEmail("system@helpdesk.com");
                systemUser.setRole(systemRole);
                systemUser.setCompany(company);
                systemUser.setDepartment(department);
                systemUser.setIsActive(true);
                systemUser.setCreatedUserId(1L); // Self-referential
                systemUser.setSortOrder(0);
                systemUser = userRepository.save(systemUser);

                // Now create other roles with system user id
                Role adminRole = createRole("ADMIN", 2, systemUser.getId());
                Role userRole = createRole("USER", 3, systemUser.getId());
                Role viewerRole = createRole("VIEWER", 4, systemUser.getId());

                // Create Test Users
                createUser("admin", "admin123", "admin@helpdesk.com", adminRole, company, department, systemUser.getId());
                createUser("user", "user123", "user@helpdesk.com", userRole, company, department, systemUser.getId());
                createUser("viewer", "viewer123", "viewer@helpdesk.com", viewerRole, company, department, systemUser.getId());

                System.out.println("✅ Database initialized successfully!");
                System.out.println("\n📋 Test Users Created:");
                System.out.println("   Username: system  | Password: system123 | Role: SYSTEM");
                System.out.println("   Username: admin   | Password: admin123  | Role: ADMIN");
                System.out.println("   Username: user    | Password: user123   | Role: USER");
                System.out.println("   Username: viewer  | Password: viewer123 | Role: VIEWER");
                System.out.println("\n🔐 Use these credentials to test JWT authentication");
            }
        };
    }

    private Role createRole(String name, int sortOrder, Long createdUserId) {
        Role role = new Role();
        role.setName(name);
        role.setSortOrder(sortOrder);
        role.setIsActive(true);
        role.setCreatedUserId(createdUserId);
        return roleRepository.save(role);
    }

    private void createUser(String username, String password, String email, Role role, Company company, Department department, Long createdUserId) {
        User user = new User();
        user.setName(username); // Set name from BaseAuditable
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole(role);
        user.setCompany(company);
        user.setDepartment(department);
        user.setIsActive(true);
        user.setCreatedUserId(createdUserId);
        user.setSortOrder(0);
        userRepository.save(user);
    }
}
