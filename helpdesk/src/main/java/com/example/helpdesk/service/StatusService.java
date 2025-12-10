package com.example.helpdesk.service;

import com.example.helpdesk.domain.Status;
import com.example.helpdesk.dto.CreateStatusDto;
import com.example.helpdesk.repository.StatusRepository;
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
public class StatusService {

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private AuditUserProvider auditUserProvider;

    public Page<Status> findAll(Pageable pageable) {
        return statusRepository.findAll(pageable);
    }

    public Page<Status> findAllActive(Pageable pageable) {
        return statusRepository.findByIsActiveTrue(pageable);
    }

    public Optional<Status> findById(Long id) {
        return statusRepository.findById(id);
    }

    public Status save(Status status) {
        if (status.getId() == null) {
            status.setCreatedTime(Instant.now());
            status.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        } else {
            status.setUpdatedTime(Instant.now());
            status.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        }
        return statusRepository.save(status);
    }

    public Status activate(Long id) {
        Status status = statusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Status not found"));
        status.setIsActive(true);
        status.setUpdatedTime(Instant.now());
        status.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return statusRepository.save(status);
    }

    public Status deactivate(Long id) {
        Status status = statusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Status not found"));
        status.setIsActive(false);
        status.setUpdatedTime(Instant.now());
        status.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return statusRepository.save(status);
    }

    public void delete(Long id) {
        statusRepository.deleteById(id);
    }

    public Page<Status> findAll(String name, Pageable pageable) {
        if (name != null && !name.isEmpty()) {
            return statusRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name, pageable);
        } else {
            return statusRepository.findByIsActiveTrue(pageable);
        }
    }

    public Status create(CreateStatusDto dto) {
        Status status = new Status();
        status.setName(dto.getName());
        status.setSortOrder(dto.getSortOrder());
        status.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        status.setCreatedTime(Instant.now());
        status.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return statusRepository.save(status);
    }

    public Status update(Long id, CreateStatusDto dto) {
        Status status = statusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Status not found"));
        status.setName(dto.getName());
        status.setSortOrder(dto.getSortOrder());
        status.setIsActive(dto.getIsActive());
        status.setUpdatedTime(Instant.now());
        status.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return statusRepository.save(status);
    }
}
