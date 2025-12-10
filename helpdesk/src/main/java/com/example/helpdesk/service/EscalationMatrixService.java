package com.example.helpdesk.service;

import com.example.helpdesk.domain.EscalationMatrix;
import com.example.helpdesk.domain.EscalationType;
import com.example.helpdesk.domain.Subcategory;
import com.example.helpdesk.dto.CreateEscalationMatrixDto;
import com.example.helpdesk.repository.EscalationMatrixRepository;
import com.example.helpdesk.repository.SubcategoryRepository;
import com.example.helpdesk.config.AuditUserProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EscalationMatrixService {

    @Autowired
    private EscalationMatrixRepository escalationMatrixRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private AuditUserProvider auditUserProvider;

    public Page<EscalationMatrix> findAll(Pageable pageable) {
        return escalationMatrixRepository.findAll(pageable);
    }

    public Optional<EscalationMatrix> findById(Long id) {
        return escalationMatrixRepository.findById(id);
    }

    public List<EscalationMatrix> findBySubcategoryIdAndType(Long subcategoryId, EscalationType type) {
        return escalationMatrixRepository.findBySubcategoryIdAndType(subcategoryId, type);
    }

    public EscalationMatrix create(CreateEscalationMatrixDto dto) {
        // Validate subcategory exists
        Subcategory subcategory = subcategoryRepository.findById(dto.getSubcategoryId())
                .orElseThrow(() -> new RuntimeException("Subcategory not found"));

        // Validate from < to
        if (dto.getFrom() >= dto.getTo()) {
            throw new RuntimeException("From value must be less than To value");
        }

        // Check for overlapping ranges
        List<EscalationMatrix> overlapping = escalationMatrixRepository.findOverlappingRanges(
                dto.getSubcategoryId(), dto.getType(), dto.getFrom(), dto.getTo());
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Overlapping range exists for the same subcategory and type");
        }

        // Check if total range exceeds 100% (assuming 0-100 scale)
        List<EscalationMatrix> existing = escalationMatrixRepository.findBySubcategoryIdAndType(dto.getSubcategoryId(), dto.getType());
        int totalRange = existing.stream().mapToInt(em -> em.getTo() - em.getFrom()).sum() + (dto.getTo() - dto.getFrom());
        if (totalRange > 100) {
            throw new RuntimeException("Total range for subcategory and type cannot exceed 100%");
        }

        EscalationMatrix escalationMatrix = new EscalationMatrix();
        escalationMatrix.setSubcategory(subcategory);
        escalationMatrix.setType(dto.getType());
        escalationMatrix.setFrom(dto.getFrom());
        escalationMatrix.setTo(dto.getTo());
        escalationMatrix.setEmail(dto.getEmail());
        escalationMatrix.setCreatedTime(Instant.now());
        escalationMatrix.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());
        escalationMatrix.setIsActive(true);
        escalationMatrix.setSortOrder(0);

        return escalationMatrixRepository.save(escalationMatrix);
    }

    public EscalationMatrix update(Long id, CreateEscalationMatrixDto dto) {
        EscalationMatrix escalationMatrix = escalationMatrixRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EscalationMatrix not found"));

        // Validate subcategory exists
        Subcategory subcategory = subcategoryRepository.findById(dto.getSubcategoryId())
                .orElseThrow(() -> new RuntimeException("Subcategory not found"));

        // Validate from < to
        if (dto.getFrom() >= dto.getTo()) {
            throw new RuntimeException("From value must be less than To value");
        }

        // Check for overlapping ranges, excluding current
        List<EscalationMatrix> overlapping = escalationMatrixRepository.findOverlappingRanges(
                dto.getSubcategoryId(), dto.getType(), dto.getFrom(), dto.getTo());
        overlapping.removeIf(em -> em.getId().equals(id));
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Overlapping range exists for the same subcategory and type");
        }

        // Check total range
        List<EscalationMatrix> existing = escalationMatrixRepository.findBySubcategoryIdAndType(dto.getSubcategoryId(), dto.getType());
        existing.removeIf(em -> em.getId().equals(id));
        int totalRange = existing.stream().mapToInt(em -> em.getTo() - em.getFrom()).sum() + (dto.getTo() - dto.getFrom());
        if (totalRange > 100) {
            throw new RuntimeException("Total range for subcategory and type cannot exceed 100%");
        }

        escalationMatrix.setSubcategory(subcategory);
        escalationMatrix.setType(dto.getType());
        escalationMatrix.setFrom(dto.getFrom());
        escalationMatrix.setTo(dto.getTo());
        escalationMatrix.setEmail(dto.getEmail());
        escalationMatrix.setUpdatedTime(Instant.now());
        escalationMatrix.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());

        return escalationMatrixRepository.save(escalationMatrix);
    }

    public void delete(Long id) {
        escalationMatrixRepository.deleteById(id);
    }

    // Method to get the escalation email for a given subcategory, type, and SLA percentage
    public Optional<String> getEscalationEmail(Long subcategoryId, EscalationType type, int percentage) {
        List<EscalationMatrix> rules = findBySubcategoryIdAndType(subcategoryId, type);
        for (EscalationMatrix rule : rules) {
            if (percentage >= rule.getFrom() && percentage <= rule.getTo()) {
                return Optional.of(rule.getEmail());
            }
        }
        return Optional.empty();
    }
}
