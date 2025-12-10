package com.example.helpdesk.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "priority_list")
@Getter
@Setter
public class PriorityList extends BaseAuditable {
}
