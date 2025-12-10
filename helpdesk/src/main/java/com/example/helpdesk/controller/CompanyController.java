package com.example.helpdesk.controller;

import com.example.helpdesk.domain.Company;
import com.example.helpdesk.dto.CompanyDto;
import com.example.helpdesk.dto.CreateCompanyDto;
import com.example.helpdesk.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping
    public Page<CompanyDto> getAll(@RequestParam(required = false) String name, Pageable pageable) {
        Page<Company> companies = companyService.findAll( pageable);
        return companies.map(this::toDto);
    }

    @GetMapping("/{id}")
    public CompanyDto getById(@PathVariable Long id) {
        Company company = companyService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toDto(company);
    }

    @PostMapping
    public CompanyDto create(@RequestBody CreateCompanyDto dto) {
        Company saved = companyService.create(dto);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public CompanyDto update(@PathVariable Long id, @RequestBody CreateCompanyDto dto) {
        Company saved = companyService.update(id, dto);
        return toDto(saved);
    }

    @PatchMapping("/{id}/activate")
    public CompanyDto activate(@PathVariable Long id) {
        Company company = companyService.activate(id);
        return toDto(company);
    }

    @PatchMapping("/{id}/deactivate")
    public CompanyDto deactivate(@PathVariable Long id) {
        Company company = companyService.deactivate(id);
        return toDto(company);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        companyService.delete(id);
    }

    @GetMapping("/{id}/projects/count")
    public long getProjectCount(@PathVariable Long id) {
        return companyService.countProjectsByCompanyId(id);
    }

    private CompanyDto toDto(Company company) {
        CompanyDto dto = new CompanyDto();
        dto.setId(company.getId());
        dto.setName(company.getName());
        dto.setCreatedUserId(company.getCreatedUserId());
        dto.setCreatedTime(company.getCreatedTime());
        dto.setUpdatedByUserId(company.getUpdatedByUserId());
        dto.setUpdatedTime(company.getUpdatedTime());
        dto.setSortOrder(company.getSortOrder());
        dto.setIsActive(company.getIsActive());
        return dto;
    }
}
