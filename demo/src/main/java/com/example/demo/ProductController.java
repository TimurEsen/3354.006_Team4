package com.example.demo;

import java.time.Instant;
import java.time.LocalTime;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepo productRepository;

    public ProductController(ProductRepo mock) {
        productRepository=mock;
    }
    public ProductController() {}

    // API Call: GET http://localhost:8080/api/products
    @GetMapping
    public List<Events> getAllProducts() {
        return productRepository.findAll();
    }

    // API Call: POST http://localhost:8080/api/products
    @PostMapping
    public Events createProduct(@RequestBody AppointmentData data) {

        Instant start = convertToInstant(data.startDate, data.startTime, data.tz);
        Instant end = convertToInstant(data.endDate, data.endTime, data.tz);

        if (data.title == null || data.title.isEmpty()){
            throw new IllegalArgumentException("Event must have title");
        }
        if (start == null || end == null) {
            throw new IllegalArgumentException("Start and End must not be null");
        }
        if(start.isAfter(end)){
            throw new IllegalArgumentException("End of Event is before Start");
        }

        Events event = new Events(start, end, data.title, data.description);

        return productRepository.save(event);
    }
    public static Instant convertToInstant(String dateString, String timeString, String zoneIdString) {
        try {
            LocalDate localDate = LocalDate.parse(dateString);
            LocalTime localTime = LocalTime.parse(timeString);

            LocalDateTime localDateTime = LocalDateTime.of(localDate, localTime);

            ZoneId zoneId = ZoneId.of(zoneIdString);
            ZonedDateTime zonedDateTime = localDateTime.atZone(zoneId);

            return zonedDateTime.toInstant();

        } catch (DateTimeParseException e) {
            System.err.println("Error parsing date or time: " + e.getMessage());
            return null;
        }
    }
}