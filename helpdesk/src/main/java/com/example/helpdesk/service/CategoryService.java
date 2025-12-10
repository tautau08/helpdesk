package com.example.helpdesk.service;

import com.example.helpdesk.domain.Category;
import com.example.helpdesk.domain.Project;
import com.example.helpdesk.dto.CreateCategoryDto;
import com.example.helpdesk.repository.SubcategoryRepository;
import com.example.helpdesk.repository.CategoryRepository;
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
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private AuditUserProvider auditUserProvider;

    public Page<Category> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    public Page<Category> findAllActive(Pageable pageable) {
        return categoryRepository.findByIsActiveTrue(pageable);
    }

    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category create(CreateCategoryDto dto) {
        Category category = new Category();
        category.setName(dto.getName());
        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            category.setProject(project);
        }
        category.setSortOrder(dto.getSortOrder());
        category.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        category.setCreatedTime(Instant.now());
        category.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return categoryRepository.save(category);
    }

    public Category update(Long id, CreateCategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setName(dto.getName());
        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new RuntimeException("Project not found"));
            category.setProject(project);
        }
        category.setSortOrder(dto.getSortOrder());
        category.setIsActive(dto.getIsActive());
        category.setUpdatedTime(Instant.now());
        category.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return categoryRepository.save(category);
    }

    public Category activate(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setIsActive(true);
        category.setUpdatedTime(Instant.now());
        category.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return categoryRepository.save(category);
    }

    public Category deactivate(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setIsActive(false);
        category.setUpdatedTime(Instant.now());
        category.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return categoryRepository.save(category);
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    public long countSubcategoriesByCategoryId(Long categoryId) {
        // Ensure category exists
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return subcategoryRepository.countByCategoryId(categoryId);
    }
}
