package com.example.helpdesk.controller;

import com.example.helpdesk.domain.Subcategory;
import com.example.helpdesk.dto.CreateSubcategoryDto;
import com.example.helpdesk.dto.SubcategoryDto;
import com.example.helpdesk.service.SubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/subcategories")
public class SubcategoryController {

    @Autowired
    private SubcategoryService subcategoryService;

    @GetMapping
    public Page<SubcategoryDto> getAll(Pageable pageable) {
        Page<Subcategory> subcategories = subcategoryService.findAll(pageable);
        return subcategories.map(this::toDto);
    }

    @GetMapping("/{id}")
    public SubcategoryDto getById(@PathVariable Long id) {
        Subcategory subcategory = subcategoryService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toDto(subcategory);
    }

    @PostMapping
    public SubcategoryDto create(@RequestBody CreateSubcategoryDto dto) {
        Subcategory saved = subcategoryService.create(dto);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public SubcategoryDto update(@PathVariable Long id, @RequestBody CreateSubcategoryDto dto) {
        Subcategory saved = subcategoryService.update(id, dto);
        return toDto(saved);
    }

    @PatchMapping("/{id}/activate")
    public SubcategoryDto activate(@PathVariable Long id) {
        Subcategory subcategory = subcategoryService.activate(id);
        return toDto(subcategory);
    }

    @PatchMapping("/{id}/deactivate")
    public SubcategoryDto deactivate(@PathVariable Long id) {
        Subcategory subcategory = subcategoryService.deactivate(id);
        return toDto(subcategory);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        subcategoryService.delete(id);
    }

    private SubcategoryDto toDto(Subcategory subcategory) {
        SubcategoryDto dto = new SubcategoryDto();
        dto.setId(subcategory.getId());
        dto.setName(subcategory.getName());
        dto.setCategoryId(subcategory.getCategory() != null ? subcategory.getCategory().getId() : null);
        dto.setCreatedUserId(subcategory.getCreatedUserId());
        dto.setCreatedTime(subcategory.getCreatedTime());
        dto.setUpdatedByUserId(subcategory.getUpdatedByUserId());
        dto.setUpdatedTime(subcategory.getUpdatedTime());
        dto.setSortOrder(subcategory.getSortOrder());
        dto.setIsActive(subcategory.getIsActive());
        dto.setResponseTime(subcategory.getResponseTime());
        dto.setResolutionTime(subcategory.getResolutionTime());
        dto.setIsCustomerResponseRequired(subcategory.getIsCustomerResponseRequired());
        return dto;
    }
}
