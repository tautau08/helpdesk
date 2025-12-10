package com.example.helpdesk.service;

import com.example.helpdesk.domain.Company;
import com.example.helpdesk.domain.Project;
import com.example.helpdesk.dto.CreateProjectDto;
import com.example.helpdesk.repository.CategoryRepository;
import com.example.helpdesk.repository.CompanyRepository;
import com.example.helpdesk.repository.ProjectRepository;
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
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuditUserProvider auditUserProvider;

    public Page<Project> findAll(Pageable pageable) {
        return projectRepository.findAll(pageable);
    }

    public Page<Project> findAllActive(Pageable pageable) {
        return projectRepository.findByIsActiveTrue(pageable);
    }

    public Optional<Project> findById(Long id) {
        return projectRepository.findById(id);
    }

    public Project create(CreateProjectDto dto) {
        Project project = new Project();
        project.setName(dto.getName());
        if (dto.getCompanyId() != null) {
            Company company = companyRepository.findById(dto.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found"));
            project.setCompany(company);
        }
        project.setSortOrder(dto.getSortOrder());
        project.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        project.setCreatedTime(Instant.now());
        project.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return projectRepository.save(project);
    }

    public Project update(Long id, CreateProjectDto dto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setName(dto.getName());
        if (dto.getCompanyId() != null) {
            Company company = companyRepository.findById(dto.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found"));
            project.setCompany(company);
        }
        project.setSortOrder(dto.getSortOrder());
        project.setIsActive(dto.getIsActive());
        project.setUpdatedTime(Instant.now());
        project.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return projectRepository.save(project);
    }

    public Project activate(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setIsActive(true);
        project.setUpdatedTime(Instant.now());
        project.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return projectRepository.save(project);
    }

    public Project deactivate(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setIsActive(false);
        project.setUpdatedTime(Instant.now());
        project.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return projectRepository.save(project);
    }

    public void deleteById(Long id) {
        projectRepository.deleteById(id);
    }

    public long countCategoriesByProjectId(Long projectId) {
        // Ensure project exists
        projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return categoryRepository.countByProjectId(projectId);
    }
}
