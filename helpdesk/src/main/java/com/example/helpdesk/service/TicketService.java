package com.example.helpdesk.service;

import com.example.helpdesk.config.AuditUserProvider;
import com.example.helpdesk.domain.*;
import com.example.helpdesk.dto.CreateTicketDto;
import com.example.helpdesk.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private PriorityListRepository priorityListRepository;

    @Autowired
    private ServiceTypeRepository serviceTypeRepository;

    @Autowired
    private AuditUserProvider auditUserProvider;

    public Page<Ticket> findAll(Pageable pageable) {
        return ticketRepository.findAllWithRelations(pageable);
    }

    public Optional<Ticket> findById(Long id) {
        return ticketRepository.findByIdWithRelations(id);
    }

    public Ticket create(CreateTicketDto dto) {
        Ticket ticket = new Ticket();
        ticket.setName(dto.getName());
        ticket.setDescription(dto.getDescription());
        ticket.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        ticket.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);


        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + dto.getCompanyId()));
        ticket.setCompany(company);

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));
        ticket.setCategory(category);

        Subcategory subcategory = subcategoryRepository.findById(dto.getSubcategoryId())
                .orElseThrow(() -> new RuntimeException("Subcategory not found with id: " + dto.getSubcategoryId()));
        ticket.setSubcategory(subcategory);

        Status status = statusRepository.findById(dto.getStatusId())
                .orElseThrow(() -> new RuntimeException("Status not found with id: " + dto.getStatusId()));
        // Set BOTH submittedStatus and currentStatus to the same value on creation
        ticket.setSubmittedStatus(status);
        ticket.setCurrentStatus(status);

        PriorityList priority = priorityListRepository.findById(dto.getPriorityId())
                .orElseThrow(() -> new RuntimeException("Priority not found with id: " + dto.getPriorityId()));
        ticket.setPriority(priority);

        ServiceType serviceType = serviceTypeRepository.findById(dto.getServiceTypeId())
                .orElseThrow(() -> new RuntimeException("ServiceType not found with id: " + dto.getServiceTypeId()));
        ticket.setServiceType(serviceType);

        ticket.setImageUrls(dto.getImageUrls() != null ? dto.getImageUrls() : new ArrayList<>());

        // Set audit fields
        ticket.setCreatedTime(Instant.now());
        ticket.setCreatedUserId(auditUserProvider.getCurrentUserIdOrSystem());

        return ticketRepository.save(ticket);
    }

    public Ticket update(Long id, CreateTicketDto dto) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));

        ticket.setName(dto.getName());
        ticket.setDescription(dto.getDescription());
        ticket.setSortOrder(dto.getSortOrder());
        ticket.setIsActive(dto.getIsActive());

        // Update relationships
        if (dto.getCompanyId() != null) {
            Company company = companyRepository.findById(dto.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found with id: " + dto.getCompanyId()));
            ticket.setCompany(company);
        }

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));
            ticket.setCategory(category);
        }

        if (dto.getSubcategoryId() != null) {
            Subcategory subcategory = subcategoryRepository.findById(dto.getSubcategoryId())
                    .orElseThrow(() -> new RuntimeException("Subcategory not found with id: " + dto.getSubcategoryId()));
            ticket.setSubcategory(subcategory);
        }

        // Update ONLY currentStatus, NOT submittedStatus (it's immutable)
        if (dto.getStatusId() != null) {
            Status status = statusRepository.findById(dto.getStatusId())
                    .orElseThrow(() -> new RuntimeException("Status not found with id: " + dto.getStatusId()));
            ticket.setCurrentStatus(status);
        }

        if (dto.getPriorityId() != null) {
            PriorityList priority = priorityListRepository.findById(dto.getPriorityId())
                    .orElseThrow(() -> new RuntimeException("Priority not found with id: " + dto.getPriorityId()));
            ticket.setPriority(priority);
        }

        if (dto.getServiceTypeId() != null) {
            ServiceType serviceType = serviceTypeRepository.findById(dto.getServiceTypeId())
                    .orElseThrow(() -> new RuntimeException("ServiceType not found with id: " + dto.getServiceTypeId()));
            ticket.setServiceType(serviceType);
        }

        // Set audit fields
        ticket.setUpdatedTime(Instant.now());
        ticket.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());

        return ticketRepository.save(ticket);
    }

    public Ticket activate(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
        ticket.setIsActive(true);
        ticket.setUpdatedTime(Instant.now());
        ticket.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return ticketRepository.save(ticket);
    }

    public Ticket deactivate(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + id));
        ticket.setIsActive(false);
        ticket.setUpdatedTime(Instant.now());
        ticket.setUpdatedByUserId(auditUserProvider.getCurrentUserIdOrSystem());
        return ticketRepository.save(ticket);
    }

    public void delete(Long id) {
        ticketRepository.deleteById(id);
    }

    public Page<Ticket> findByCreatedUser(Long userId, Pageable pageable) {
        return ticketRepository.findByCreatedUserIdAndIsActiveTrueWithRelations(userId, pageable);
    }
}
