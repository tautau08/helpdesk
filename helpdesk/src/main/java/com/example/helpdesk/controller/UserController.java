package com.example.helpdesk.controller;

import com.example.helpdesk.dto.CreateUserDto;
import com.example.helpdesk.dto.UserDto;
import com.example.helpdesk.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public Page<UserDto> findAll(@RequestParam(required = false) String name,
                                  @RequestParam(required = false) Boolean isActive,
                                  Pageable pageable) {
        return userService.findAll(name, isActive, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDto> findByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/company/{companyId}")
    public Page<UserDto> findByCompanyId(@PathVariable Long companyId, Pageable pageable) {
        return userService.findByCompanyId(companyId, pageable);
    }

    @GetMapping("/project/{projectId}")
    public Page<UserDto> findByProjectId(@PathVariable Long projectId, Pageable pageable) {
        return userService.findByProjectId(projectId, pageable);
    }

    @GetMapping("/department/{departmentId}")
    public Page<UserDto> findByDepartmentId(@PathVariable Long departmentId, Pageable pageable) {
        return userService.findByDepartmentId(departmentId, pageable);
    }

    @GetMapping("/role/{roleId}")
    public Page<UserDto> findByRoleId(@PathVariable Long roleId, Pageable pageable) {
        return userService.findByRoleId(roleId, pageable);
    }

    @PostMapping
    public ResponseEntity<UserDto> create(@Valid @RequestBody CreateUserDto dto) {
        UserDto saved = userService.create(dto);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id, @Valid @RequestBody CreateUserDto dto) {
        UserDto updated = userService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<UserDto> activate(@PathVariable Long id) {
        UserDto user = userService.activate(id);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<UserDto> deactivate(@PathVariable Long id) {
        UserDto user = userService.deactivate(id);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

