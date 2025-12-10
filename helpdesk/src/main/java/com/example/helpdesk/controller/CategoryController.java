package com.example.helpdesk.controller;

import com.example.helpdesk.domain.Category;
import com.example.helpdesk.dto.CategoryDto;
import com.example.helpdesk.dto.CreateCategoryDto;
import com.example.helpdesk.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public Page<CategoryDto> getAll(Pageable pageable) {
        Page<Category> categories = categoryService.findAll(pageable);
        return categories.map(this::toDto);
    }

    @GetMapping("/{id}")
    public CategoryDto getById(@PathVariable Long id) {
        Category category = categoryService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toDto(category);
    }

    @PostMapping
    public CategoryDto create(@RequestBody CreateCategoryDto dto) {
        Category saved = categoryService.create(dto);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public CategoryDto update(@PathVariable Long id, @RequestBody CreateCategoryDto dto) {
        Category saved = categoryService.update(id, dto);
        return toDto(saved);
    }

    @PatchMapping("/{id}/activate")
    public CategoryDto activate(@PathVariable Long id) {
        Category category = categoryService.activate(id);
        return toDto(category);
    }

    @PatchMapping("/{id}/deactivate")
    public CategoryDto deactivate(@PathVariable Long id) {
        Category category = categoryService.deactivate(id);
        return toDto(category);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }

    @GetMapping("/{id}/subcategories/count")
    public long getSubcategoryCount(@PathVariable Long id) {
        return categoryService.countSubcategoriesByCategoryId(id);
    }

    private CategoryDto toDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setProjectId(category.getProject() != null ? category.getProject().getId() : null);
        dto.setCreatedUserId(category.getCreatedUserId());
        dto.setCreatedTime(category.getCreatedTime());
        dto.setUpdatedByUserId(category.getUpdatedByUserId());
        dto.setUpdatedTime(category.getUpdatedTime());
        dto.setSortOrder(category.getSortOrder());
        dto.setIsActive(category.getIsActive());
        return dto;
    }
}
