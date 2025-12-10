package com.example.helpdesk.service;

import com.example.helpdesk.domain.Department;
import com.example.helpdesk.dto.CreateDepartmentDto;
import com.example.helpdesk.dto.DepartmentDto;
import com.example.helpdesk.repository.DepartmentRepository;
import com.example.helpdesk.config.AuditUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final AuditUserProvider auditUserProvider;

    public DepartmentDto create(CreateDepartmentDto dto) {
        Department department = new Department();
        department.setName(dto.getName());
        department.setSortOrder(dto.getSortOrder());
        department.setIsActive(dto.getIsActive());
        department.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        department.setCreatedTime(Instant.now());
        Department saved = departmentRepository.save(department);
        return mapToDto(saved);
    }

    public Page<DepartmentDto> findAll(Pageable pageable) {
        return departmentRepository.findAll(pageable)
                .map(this::mapToDto);
    }

    public Optional<DepartmentDto> findById(Long id) {
        return departmentRepository.findById(id)
                .map(this::mapToDto);
    }

    public DepartmentDto update(Long id, CreateDepartmentDto dto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        department.setName(dto.getName());
        department.setSortOrder(dto.getSortOrder());
        department.setIsActive(dto.getIsActive());
        department.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        department.setUpdatedTime(Instant.now());
        Department updated = departmentRepository.save(department);
        return mapToDto(updated);
    }

    public void deleteById(Long id) {
        departmentRepository.deleteById(id);
    }

    public DepartmentDto activate(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        department.setIsActive(true);
        department.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        department.setUpdatedTime(Instant.now());
        Department saved = departmentRepository.save(department);
        return mapToDto(saved);
    }

    public DepartmentDto deactivate(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        department.setIsActive(false);
        department.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        department.setUpdatedTime(Instant.now());
        Department saved = departmentRepository.save(department);
        return mapToDto(saved);
    }

    private DepartmentDto mapToDto(Department department) {
        DepartmentDto dto = new DepartmentDto();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setCreatedUserId(department.getCreatedUserId());
        dto.setCreatedTime(department.getCreatedTime());
        dto.setUpdatedByUserId(department.getUpdatedByUserId());
        dto.setUpdatedTime(department.getUpdatedTime());
        dto.setSortOrder(department.getSortOrder());
        dto.setIsActive(department.getIsActive());
        return dto;
    }
}
