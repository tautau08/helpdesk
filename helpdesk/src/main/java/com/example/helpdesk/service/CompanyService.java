package com.example.helpdesk.service;

import com.example.helpdesk.domain.Company;
import com.example.helpdesk.dto.CreateCompanyDto;
import com.example.helpdesk.repository.ProjectRepository;
import com.example.helpdesk.repository.CompanyRepository;
import com.example.helpdesk.config.AuditUserProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
@Transactional
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AuditUserProvider auditUserProvider;

    public Page<Company> findAll(Pageable pageable) {
        return companyRepository.findAll(pageable);
    }

    public Page<Company> findAllActive(Pageable pageable) {
        return companyRepository.findByIsActiveTrue(pageable);
    }

    public Optional<Company> findById(Long id) {
        return companyRepository.findById(id);
    }

    public Company save(Company company) {
        if (company.getId() == null) {
            company.setCreatedTime(Instant.now());
            company.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        } else {
            company.setUpdatedTime(Instant.now());
            company.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        }
        return companyRepository.save(company);
    }

    public Company activate(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setIsActive(true);
        company.setUpdatedTime(Instant.now());
        company.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return companyRepository.save(company);
    }

    public Company deactivate(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setIsActive(false);
        company.setUpdatedTime(Instant.now());
        company.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return companyRepository.save(company);
    }

    public void delete(Long id) {
        companyRepository.deleteById(id);
    }

    public Page<Company> findAll(String name, Pageable pageable) {
        if (name != null && !name.isEmpty()) {
            return companyRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name, pageable);
        } else {
            return companyRepository.findByIsActiveTrue(pageable);
        }
    }

    public Company create(CreateCompanyDto dto) {
        Company company = new Company();
        company.setName(dto.getName());
        company.setSortOrder(dto.getSortOrder());
        company.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        company.setCreatedTime(Instant.now());
        company.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return companyRepository.save(company);
    }

    public Company update(Long id, CreateCompanyDto dto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setName(dto.getName());
        company.setSortOrder(dto.getSortOrder());
        company.setIsActive(dto.getIsActive());
        company.setUpdatedTime(Instant.now());
        company.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return companyRepository.save(company);
    }

    public long countProjectsByCompanyId(Long companyId) {
        // Ensure company exists
        companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return projectRepository.countByCompanyId(companyId);
    }
}
