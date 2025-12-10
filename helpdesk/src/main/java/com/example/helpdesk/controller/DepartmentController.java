package com.example.helpdesk.controller;

import com.example.helpdesk.dto.CreateDepartmentDto;
import com.example.helpdesk.dto.DepartmentDto;
import com.example.helpdesk.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public Page<DepartmentDto> findAll(
                                       Pageable pageable) {
        return departmentService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDto> findById(@PathVariable Long id) {
        return departmentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DepartmentDto> create(@RequestBody CreateDepartmentDto dto) {
        DepartmentDto saved = departmentService.create(dto);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDto> update(@PathVariable Long id, @RequestBody CreateDepartmentDto dto) {
        DepartmentDto updated = departmentService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<DepartmentDto> activate(@PathVariable Long id) {
        DepartmentDto department = departmentService.activate(id);
        return ResponseEntity.ok(department);
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<DepartmentDto> deactivate(@PathVariable Long id) {
        DepartmentDto department = departmentService.deactivate(id);
        return ResponseEntity.ok(department);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        departmentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
