package com.example.helpdesk.controller;

import com.example.helpdesk.domain.PriorityList;
import com.example.helpdesk.dto.CreatePriorityListDto;
import com.example.helpdesk.dto.PriorityListDto;
import com.example.helpdesk.service.PriorityListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/priorities")
public class PriorityListController {

    @Autowired
    private PriorityListService priorityListService;

    @GetMapping
    public Page<PriorityListDto> getAll(Pageable pageable) {
        Page<PriorityList> priorities = priorityListService.findAll(pageable);
        return priorities.map(this::toDto);
    }

    @GetMapping("/{id}")
    public PriorityListDto getById(@PathVariable Long id) {
        PriorityList priorityList = priorityListService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toDto(priorityList);
    }

    @PostMapping
    public PriorityListDto create(@RequestBody CreatePriorityListDto dto) {
        PriorityList saved = priorityListService.create(dto);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public PriorityListDto update(@PathVariable Long id, @RequestBody CreatePriorityListDto dto) {
        PriorityList saved = priorityListService.update(id, dto);
        return toDto(saved);
    }

    @PatchMapping("/{id}/activate")
    public PriorityListDto activate(@PathVariable Long id) {
        PriorityList priorityList = priorityListService.activate(id);
        return toDto(priorityList);
    }

    @PatchMapping("/{id}/deactivate")
    public PriorityListDto deactivate(@PathVariable Long id) {
        PriorityList priorityList = priorityListService.deactivate(id);
        return toDto(priorityList);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        priorityListService.delete(id);
    }

    private PriorityListDto toDto(PriorityList priorityList) {
        PriorityListDto dto = new PriorityListDto();
        dto.setId(priorityList.getId());
        dto.setName(priorityList.getName());
        dto.setCreatedUserId(priorityList.getCreatedUserId());
        dto.setCreatedTime(priorityList.getCreatedTime());
        dto.setUpdatedByUserId(priorityList.getUpdatedByUserId());
        dto.setUpdatedTime(priorityList.getUpdatedTime());
        dto.setSortOrder(priorityList.getSortOrder());
        dto.setIsActive(priorityList.getIsActive());
        return dto;
    }
}
