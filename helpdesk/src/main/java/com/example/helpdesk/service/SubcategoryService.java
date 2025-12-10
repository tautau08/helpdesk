package com.example.helpdesk.service;

import com.example.helpdesk.domain.Category;
import com.example.helpdesk.domain.Subcategory;
import com.example.helpdesk.dto.CreateSubcategoryDto;
import com.example.helpdesk.repository.CategoryRepository;
import com.example.helpdesk.repository.SubcategoryRepository;
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
public class SubcategoryService {

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuditUserProvider auditUserProvider;

    public Page<Subcategory> findAll(Pageable pageable) {
        return subcategoryRepository.findAll(pageable);
    }

    public Page<Subcategory> findAllActive(Pageable pageable) {
        return subcategoryRepository.findByIsActiveTrue(pageable);
    }

    public Optional<Subcategory> findById(Long id) {
        return subcategoryRepository.findById(id);
    }

    public Subcategory create(CreateSubcategoryDto dto) {
        Subcategory subcategory = new Subcategory();
        subcategory.setName(dto.getName());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            subcategory.setCategory(category);
        }
        subcategory.setSortOrder(dto.getSortOrder());
        subcategory.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        subcategory.setCreatedTime(Instant.now());
        subcategory.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        subcategory.setResponseTime(dto.getResponseTime());
        subcategory.setResolutionTime(dto.getResolutionTime());
        subcategory.setIsCustomerResponseRequired(dto.getIsCustomerResponseRequired());
        return subcategoryRepository.save(subcategory);
    }

    public Subcategory update(Long id, CreateSubcategoryDto dto) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subcategory not found"));
        subcategory.setName(dto.getName());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            subcategory.setCategory(category);
        }
        subcategory.setSortOrder(dto.getSortOrder());
        subcategory.setIsActive(dto.getIsActive());
        subcategory.setUpdatedTime(Instant.now());
        subcategory.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        subcategory.setResponseTime(dto.getResponseTime());
        subcategory.setResolutionTime(dto.getResolutionTime());
        subcategory.setIsCustomerResponseRequired(dto.getIsCustomerResponseRequired());
        return subcategoryRepository.save(subcategory);
    }

    public Subcategory activate(Long id) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subcategory not found"));
        subcategory.setIsActive(true);
        subcategory.setUpdatedTime(Instant.now());
        subcategory.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return subcategoryRepository.save(subcategory);
    }

    public Subcategory deactivate(Long id) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subcategory not found"));
        subcategory.setIsActive(false);
        subcategory.setUpdatedTime(Instant.now());
        subcategory.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return subcategoryRepository.save(subcategory);
    }

    public void delete(Long id) {
        subcategoryRepository.deleteById(id);
    }
}
