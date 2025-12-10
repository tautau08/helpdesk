package com.example.helpdesk.controller;

import com.example.helpdesk.domain.EscalationMatrix;
import com.example.helpdesk.domain.EscalationType;
import com.example.helpdesk.dto.CreateEscalationMatrixDto;
import com.example.helpdesk.dto.EscalationMatrixDto;
import com.example.helpdesk.service.EscalationMatrixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/escalation-matrices")
public class EscalationMatrixController {

    @Autowired
    private EscalationMatrixService escalationMatrixService;

    @GetMapping
    public Page<EscalationMatrixDto> getAll(Pageable pageable) {
        Page<EscalationMatrix> matrices = escalationMatrixService.findAll(pageable);
        return matrices.map(this::toDto);
    }

    @GetMapping("/{id}")
    public EscalationMatrixDto getById(@PathVariable Long id) {
        EscalationMatrix matrix = escalationMatrixService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toDto(matrix);
    }

    @GetMapping("/subcategory/{subcategoryId}/type/{type}")
    public List<EscalationMatrixDto> getBySubcategoryAndType(@PathVariable Long subcategoryId, @PathVariable EscalationType type) {
        List<EscalationMatrix> matrices = escalationMatrixService.findBySubcategoryIdAndType(subcategoryId, type);
        return matrices.stream().map(this::toDto).collect(Collectors.toList());
    }

    @PostMapping
    public EscalationMatrixDto create(@RequestBody CreateEscalationMatrixDto dto) {
        EscalationMatrix saved = escalationMatrixService.create(dto);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public EscalationMatrixDto update(@PathVariable Long id, @RequestBody CreateEscalationMatrixDto dto) {
        EscalationMatrix saved = escalationMatrixService.update(id, dto);
        return toDto(saved);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        escalationMatrixService.delete(id);
    }

    private EscalationMatrixDto toDto(EscalationMatrix matrix) {
        EscalationMatrixDto dto = new EscalationMatrixDto();
        dto.setId(matrix.getId());
        dto.setSubcategoryId(matrix.getSubcategory().getId());
        dto.setType(matrix.getType());
        dto.setFrom(matrix.getFrom());
        dto.setTo(matrix.getTo());
        dto.setEmail(matrix.getEmail());
        dto.setCreatedUserId(matrix.getCreatedUserId());
        dto.setCreatedTime(matrix.getCreatedTime());
        dto.setUpdatedByUserId(matrix.getUpdatedByUserId());
        dto.setUpdatedTime(matrix.getUpdatedTime());
        dto.setSortOrder(matrix.getSortOrder());
        dto.setIsActive(matrix.getIsActive());
        return dto;
    }
}
