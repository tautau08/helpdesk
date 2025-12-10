package com.example.helpdesk.controller;

import com.example.helpdesk.domain.ServiceType;
import com.example.helpdesk.dto.CreateServiceTypeDto;
import com.example.helpdesk.dto.ServiceTypeDto;
import com.example.helpdesk.service.ServiceTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/service-types")
public class ServiceTypeController {

    @Autowired
    private ServiceTypeService serviceTypeService;

    @GetMapping
    public Page<ServiceTypeDto> getAll(Pageable pageable) {
        Page<ServiceType> serviceTypes = serviceTypeService.findAll(pageable);
        return serviceTypes.map(this::toDto);
    }

    @GetMapping("/{id}")
    public ServiceTypeDto getById(@PathVariable Long id) {
        ServiceType serviceType = serviceTypeService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toDto(serviceType);
    }

    @PostMapping
    public ServiceTypeDto create(@RequestBody CreateServiceTypeDto dto) {
        ServiceType saved = serviceTypeService.create(dto);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public ServiceTypeDto update(@PathVariable Long id, @RequestBody CreateServiceTypeDto dto) {
        ServiceType saved = serviceTypeService.update(id, dto);
        return toDto(saved);
    }

    @PatchMapping("/{id}/activate")
    public ServiceTypeDto activate(@PathVariable Long id) {
        ServiceType serviceType = serviceTypeService.activate(id);
        return toDto(serviceType);
    }

    @PatchMapping("/{id}/deactivate")
    public ServiceTypeDto deactivate(@PathVariable Long id) {
        ServiceType serviceType = serviceTypeService.deactivate(id);
        return toDto(serviceType);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        serviceTypeService.delete(id);
    }

    private ServiceTypeDto toDto(ServiceType serviceType) {
        ServiceTypeDto dto = new ServiceTypeDto();
        dto.setId(serviceType.getId());
        dto.setName(serviceType.getName());
        dto.setCreatedUserId(serviceType.getCreatedUserId());
        dto.setCreatedTime(serviceType.getCreatedTime());
        dto.setUpdatedByUserId(serviceType.getUpdatedByUserId());
        dto.setUpdatedTime(serviceType.getUpdatedTime());
        dto.setSortOrder(serviceType.getSortOrder());
        dto.setIsActive(serviceType.getIsActive());
        return dto;
    }
}
