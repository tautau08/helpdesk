package com.example.helpdesk.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "service_types")
@Getter
@Setter
public class ServiceType extends BaseAuditable {
}
