package com.example.helpdesk.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "menus")
@Getter
@Setter
public class Menu extends BaseAuditable {

    @ManyToMany(mappedBy = "menus")
    private Set<Role> roles = new HashSet<>();
}
