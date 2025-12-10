package com.example.helpdesk.controller;

import com.example.helpdesk.domain.Status;
import com.example.helpdesk.dto.CreateStatusDto;
import com.example.helpdesk.dto.StatusDto;
import com.example.helpdesk.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/statuses")
public class StatusController {

    @Autowired
    private StatusService statusService;

    @GetMapping
    public Page<StatusDto> getAll(@RequestParam(required = false) String name, Pageable pageable) {
        Page<Status> statuses = statusService.findAll(pageable);
        return statuses.map(this::toDto);
    }

    @GetMapping("/{id}")
    public StatusDto getById(@PathVariable Long id) {
        Status status = statusService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toDto(status);
    }

    @PostMapping
    public StatusDto create(@RequestBody CreateStatusDto dto) {
        Status saved = statusService.create(dto);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public StatusDto update(@PathVariable Long id, @RequestBody CreateStatusDto dto) {
        Status saved = statusService.update(id, dto);
        return toDto(saved);
    }

    @PatchMapping("/{id}/activate")
    public StatusDto activate(@PathVariable Long id) {
        Status status = statusService.activate(id);
        return toDto(status);
    }

    @PatchMapping("/{id}/deactivate")
    public StatusDto deactivate(@PathVariable Long id) {
        Status status = statusService.deactivate(id);
        return toDto(status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        statusService.delete(id);
    }

    private StatusDto toDto(Status status) {
        StatusDto dto = new StatusDto();
        dto.setId(status.getId());
        dto.setName(status.getName());
        dto.setCreatedUserId(status.getCreatedUserId());
        dto.setCreatedTime(status.getCreatedTime());
        dto.setUpdatedByUserId(status.getUpdatedByUserId());
        dto.setUpdatedTime(status.getUpdatedTime());
        dto.setSortOrder(status.getSortOrder());
        dto.setIsActive(status.getIsActive());
        return dto;
    }
}
