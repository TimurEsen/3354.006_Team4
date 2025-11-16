package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductRepo extends JpaRepository<Events, Long> {
    Optional<Events> findById(UUID savedId);
}
