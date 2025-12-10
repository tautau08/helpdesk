package com.example.helpdesk.controller;

import com.example.helpdesk.domain.Project;
import com.example.helpdesk.dto.CreateProjectDto;
import com.example.helpdesk.dto.ProjectDto;
import com.example.helpdesk.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public Page<ProjectDto> getAll(@RequestParam(required = false) String name, Pageable pageable) {
        Page<Project> projects = projectService.findAll( pageable);
        return projects.map(this::toDto);
    }

    @GetMapping("/{id}")
    public ProjectDto getById(@PathVariable Long id) {
        Project project = projectService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toDto(project);
    }

    @PostMapping
    public ProjectDto create(@RequestBody CreateProjectDto dto) {
        Project saved = projectService.create(dto);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public ProjectDto update(@PathVariable Long id, @RequestBody CreateProjectDto dto) {
        Project saved = projectService.update(id, dto);
        return toDto(saved);
    }

    @PatchMapping("/{id}/activate")
    public ProjectDto activate(@PathVariable Long id) {
        Project project = projectService.activate(id);
        return toDto(project);
    }

    @PatchMapping("/{id}/deactivate")
    public ProjectDto deactivate(@PathVariable Long id) {
        Project project = projectService.deactivate(id);
        return toDto(project);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        projectService.deleteById(id);
    }

    @GetMapping("/{id}/categories/count")
    public long getCategoryCount(@PathVariable Long id) {
        return projectService.countCategoriesByProjectId(id);
    }

    private ProjectDto toDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setCompanyId(project.getCompany() != null ? project.getCompany().getId() : null);
        dto.setCreatedUserId(project.getCreatedUserId());
        dto.setCreatedTime(project.getCreatedTime());
        dto.setUpdatedByUserId(project.getUpdatedByUserId());
        dto.setUpdatedTime(project.getUpdatedTime());
        dto.setSortOrder(project.getSortOrder());
        dto.setIsActive(project.getIsActive());
        return dto;
    }
}
