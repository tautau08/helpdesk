package com.example.helpdesk.controller;

import com.example.helpdesk.domain.Ticket;
import com.example.helpdesk.dto.CreateTicketDto;
import com.example.helpdesk.dto.TicketDto;
import com.example.helpdesk.service.ImageUploadService;
import com.example.helpdesk.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private ImageUploadService imageUploadService;

    @GetMapping
    public Page<TicketDto> getAll(Pageable pageable) {
        Page<Ticket> tickets = ticketService.findAll(pageable);
        return tickets.map(this::toDto);
    }

    @GetMapping("/{id}")
    public TicketDto getById(@PathVariable Long id) {
        Ticket ticket = ticketService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found with id: " + id));
        return toDto(ticket);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TicketDto create(@ModelAttribute CreateTicketDto request) throws IOException {
        List<String> imageUrls = new ArrayList<>();
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            imageUrls = imageUploadService.uploadImages(request.getImages());
        }

        CreateTicketDto dto = new CreateTicketDto();
        dto.setName(request.getName());
        dto.setCompanyId(request.getCompanyId());
        dto.setCategoryId(request.getCategoryId());
        dto.setSubcategoryId(request.getSubcategoryId());
        dto.setStatusId(request.getStatusId());
        dto.setPriorityId(request.getPriorityId());
        dto.setServiceTypeId(request.getServiceTypeId());
        dto.setDescription(request.getDescription());
        dto.setSortOrder(request.getSortOrder());
        dto.setIsActive(request.getIsActive());
        dto.setImageUrls(imageUrls);

        Ticket saved = ticketService.create(dto);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public TicketDto update(@PathVariable Long id, @RequestBody CreateTicketDto dto) {
        Ticket saved = ticketService.update(id, dto);
        return toDto(saved);
    }

    @PatchMapping("/{id}/activate")
    public TicketDto activate(@PathVariable Long id) {
        Ticket ticket = ticketService.activate(id);
        return toDto(ticket);
    }

    @PatchMapping("/{id}/deactivate")
    public TicketDto deactivate(@PathVariable Long id) {
        Ticket ticket = ticketService.deactivate(id);
        return toDto(ticket);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        ticketService.delete(id);
    }

    @GetMapping("/user/{userId}")
    public Page<TicketDto> getByUser(@PathVariable Long userId, Pageable pageable) {
        Page<Ticket> tickets = ticketService.findByCreatedUser(userId, pageable);
        return tickets.map(this::toDto);
    }

    private TicketDto toDto(Ticket ticket) {
        TicketDto dto = new TicketDto();
        dto.setId(ticket.getId());
        dto.setName(ticket.getName());
        dto.setDescription(ticket.getDescription());

        // Company
        dto.setCompanyId(ticket.getCompany().getId());
        dto.setCompanyName(ticket.getCompany().getName());

        // Category
        dto.setCategoryId(ticket.getCategory().getId());
        dto.setCategoryName(ticket.getCategory().getName());

        // Subcategory
        dto.setSubcategoryId(ticket.getSubcategory().getId());
        dto.setSubcategoryName(ticket.getSubcategory().getName());

        // Submitted Status (immutable)
        dto.setSubmittedStatusId(ticket.getSubmittedStatus().getId());
        dto.setSubmittedStatusName(ticket.getSubmittedStatus().getName());

        // Current Status (mutable)
        dto.setCurrentStatusId(ticket.getCurrentStatus().getId());
        dto.setCurrentStatusName(ticket.getCurrentStatus().getName());

        // Priority
        dto.setPriorityId(ticket.getPriority().getId());
        dto.setPriorityName(ticket.getPriority().getName());

        // Service Type
        dto.setServiceTypeId(ticket.getServiceType().getId());
        dto.setServiceTypeName(ticket.getServiceType().getName());

        // Audit fields
        dto.setCreatedUserId(ticket.getCreatedUserId());
        dto.setCreatedTime(ticket.getCreatedTime());
        dto.setUpdatedByUserId(ticket.getUpdatedByUserId());
        dto.setUpdatedTime(ticket.getUpdatedTime());
        dto.setSortOrder(ticket.getSortOrder());
        dto.setIsActive(ticket.getIsActive());

        dto.setImageUrls(ticket.getImageUrls());

        return dto;
    }
}
