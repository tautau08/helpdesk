package com.example.helpdesk.service;

import com.example.helpdesk.domain.PriorityList;
import com.example.helpdesk.dto.CreatePriorityListDto;
import com.example.helpdesk.repository.PriorityListRepository;
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
public class PriorityListService {

    @Autowired
    private PriorityListRepository priorityListRepository;

    @Autowired
    private AuditUserProvider auditUserProvider;

    public Page<PriorityList> findAll(Pageable pageable) {
        return priorityListRepository.findAll(pageable);
    }

    public Page<PriorityList> findAllActive(Pageable pageable) {
        return priorityListRepository.findByIsActiveTrue(pageable);
    }

    public Optional<PriorityList> findById(Long id) {
        return priorityListRepository.findById(id);
    }

    public PriorityList activate(Long id) {
        PriorityList priorityList = priorityListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PriorityList not found"));
        priorityList.setIsActive(true);
        priorityList.setUpdatedTime(Instant.now());
        priorityList.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return priorityListRepository.save(priorityList);
    }

    public PriorityList deactivate(Long id) {
        PriorityList priorityList = priorityListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PriorityList not found"));
        priorityList.setIsActive(false);
        priorityList.setUpdatedTime(Instant.now());
        priorityList.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return priorityListRepository.save(priorityList);
    }

    public void delete(Long id) {
        priorityListRepository.deleteById(id);
    }

    public PriorityList create(CreatePriorityListDto dto) {
        PriorityList priorityList = new PriorityList();
        priorityList.setName(dto.getName());
        priorityList.setSortOrder(dto.getSortOrder());
        priorityList.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);
        priorityList.setCreatedTime(Instant.now());
        priorityList.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return priorityListRepository.save(priorityList);
    }

    public PriorityList update(Long id, CreatePriorityListDto dto) {
        PriorityList priorityList = priorityListRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PriorityList not found"));
        priorityList.setName(dto.getName());
        priorityList.setSortOrder(dto.getSortOrder());
        priorityList.setIsActive(dto.getIsActive());
        priorityList.setUpdatedTime(Instant.now());
        priorityList.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return priorityListRepository.save(priorityList);
    }
}
