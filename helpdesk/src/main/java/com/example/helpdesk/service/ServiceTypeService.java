package com.example.helpdesk.service;

import com.example.helpdesk.domain.ServiceType;
import com.example.helpdesk.dto.CreateServiceTypeDto;
import com.example.helpdesk.repository.ServiceTypeRepository;
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
public class ServiceTypeService {

    @Autowired
    private ServiceTypeRepository serviceTypeRepository;

    @Autowired
    private AuditUserProvider auditUserProvider;

    public Page<ServiceType> findAll(Pageable pageable) {
        return serviceTypeRepository.findAll(pageable);
    }

    public Page<ServiceType> findAllActive(Pageable pageable) {
        return serviceTypeRepository.findByIsActiveTrue(pageable);
    }

    public Optional<ServiceType> findById(Long id) {
        return serviceTypeRepository.findById(id);
    }

    public ServiceType save(ServiceType serviceType) {
        if (serviceType.getId() == null) {
            serviceType.setCreatedTime(Instant.now());
            serviceType.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        } else {
            serviceType.setUpdatedTime(Instant.now());
            serviceType.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        }
        return serviceTypeRepository.save(serviceType);
    }

    public ServiceType activate(Long id) {
        ServiceType serviceType = serviceTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceType not found"));
        serviceType.setIsActive(true);
        serviceType.setUpdatedTime(Instant.now());
        serviceType.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return serviceTypeRepository.save(serviceType);
    }

    public ServiceType deactivate(Long id) {
        ServiceType serviceType = serviceTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceType not found"));
        serviceType.setIsActive(false);
        serviceType.setUpdatedTime(Instant.now());
        serviceType.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return serviceTypeRepository.save(serviceType);
    }

    public void delete(Long id) {
        serviceTypeRepository.deleteById(id);
    }

    public Page<ServiceType> findAll(String name, Pageable pageable) {
        if (name != null && !name.isEmpty()) {
            return serviceTypeRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(name, pageable);
        } else {
            return serviceTypeRepository.findByIsActiveTrue(pageable);
        }
    }

    public ServiceType create(CreateServiceTypeDto dto) {
        ServiceType serviceType = new ServiceType();
        serviceType.setName(dto.getName());
        serviceType.setSortOrder(dto.getSortOrder());
        serviceType.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        serviceType.setCreatedTime(Instant.now());
        serviceType.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return serviceTypeRepository.save(serviceType);
    }

    public ServiceType update(Long id, CreateServiceTypeDto dto) {
        ServiceType serviceType = serviceTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceType not found"));
        serviceType.setName(dto.getName());
        serviceType.setSortOrder(dto.getSortOrder());
        serviceType.setIsActive(dto.getIsActive());
        serviceType.setUpdatedTime(Instant.now());
        serviceType.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return serviceTypeRepository.save(serviceType);
    }
}
