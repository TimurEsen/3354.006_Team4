package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
class ProductControllerTest {

    @Autowired
    private ProductController productController;
    @Autowired
    private ProductRepo productRepo;

    @Test
    void test_createProduct_pass(){
        AppointmentData event = new AppointmentData();
        event.title = "Passable Event";
        event.description = "This is testing if I can make a new event. It will pass";
        event.tz = "America/Chicago";
        event.startDate = "2025-12-01";
        event.startTime = "10:00";
        event.endDate = "2025-12-01";
        event.endTime = "11:00";

        Events createdEvent = productController.createProduct(event);
        UUID savedId = createdEvent.getID();
        Events foundInDb = productRepo.findById(savedId)
                .orElseGet(() -> fail("Event was not found in the database with ID: " + savedId));

        assertEquals(event.title, foundInDb.getTitle());
        assertEquals(event.description, foundInDb.getDescription());

        Instant startTime = ProductController.convertToInstant(event.startDate, event.startTime, event.tz);
        Instant endTime = ProductController.convertToInstant(event.endDate, event.endTime, event.tz);
        assertEquals(startTime, foundInDb.getDtstart());
        assertEquals(endTime, foundInDb.getDtend());

        assertEquals(savedId, foundInDb.getID(), "ID of the retrieved object is incorrect.");
    }




    //* Catches no title passed
    @Test
    void test_createProduct_fail_titleNull() {
        AppointmentData titleNull = new AppointmentData();
        titleNull.title = null;
        titleNull.description = "Testing a null Title";
        titleNull.tz = "America/Chicago";
        titleNull.startDate = "2025-12-01";
        titleNull.startTime = "10:00";
        titleNull.endDate = "2025-12-01";
        titleNull.endTime = "11:00";
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(titleNull),
                "Null title should throw IllegalArgumentException");
    }
    @Test
    void test_createProduct_fail_titleEmpty() {
        AppointmentData titleEmpty = new AppointmentData();
        titleEmpty.title = "";
        titleEmpty.description = "Testing an empty Title";
        titleEmpty.tz = "America/Chicago";
        titleEmpty.startDate = "2025-12-01";
        titleEmpty.startTime = "10:00";
        titleEmpty.endDate = "2025-12-01";
        titleEmpty.endTime = "11:00";
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(titleEmpty),
                "Empty title should throw IllegalArgumentException");
    }

    //* Catches no Start or End passed
    @Test
    void test_createProduct_fail_noStart() {
        AppointmentData noStart = new AppointmentData();
        noStart.title = "noStart";
        noStart.description = "Testing no Start time";
        noStart.tz = "America/Chicago";
        noStart.startDate = "2025-12-01";
        noStart.startTime = "This will make convertToInstant return null";
        noStart.endDate = "2025-12-01";
        noStart.endTime = "11:00";
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(noStart),
                "No start should throw IllegalArgumentException");
    }
    @Test
    void test_createProduct_fail_noEnd() {
        AppointmentData noEnd = new AppointmentData();
        noEnd.title = "noEnd";
        noEnd.description = "Testing no end time";
        noEnd.tz = "America/Chicago";
        noEnd.startDate = "2025-12-01";
        noEnd.startTime = "10:00";
        noEnd.endDate = "This will make convertToInstant return null";
        noEnd.endTime = "11:00";
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(noEnd),
                "No end should throw IllegalArgumentException");
    }
    @Test
    void test_createProduct_fail_noStartorEnd() {
        AppointmentData noStartorEnd = new AppointmentData();
        noStartorEnd.title = "noStartorEnd";
        noStartorEnd.description = "Testing no start or end time";
        noStartorEnd.tz = "America/Chicago";
        noStartorEnd.startDate = "This will make convertToInstant return null";
        noStartorEnd.startTime = "10:00";
        noStartorEnd.endDate = "2025-12-01";
        noStartorEnd.endTime = "This will make convertToInstant return null";
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(noStartorEnd),
                "No start or end should throw IllegalArgumentException");

    }

    //* Catches Start time set after End
    @Test
    void test_createProduct_fail_differOnSameDay_mins() {
        AppointmentData differOnSameDay_mins = new AppointmentData();
        differOnSameDay_mins.title = "differOnSameDay_min";
        differOnSameDay_mins.description = "Differ by mins";
        differOnSameDay_mins.tz = "America/Chicago";
        differOnSameDay_mins.startDate = "2025-12-01";
        differOnSameDay_mins.startTime = "11:00";
        differOnSameDay_mins.endDate = "2025-12-01";
        differOnSameDay_mins.endTime = "10:59";
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(differOnSameDay_mins),
                "No start or end should throw IllegalArgumentException");
    }
    @Test
    void test_createProduct_fail_differsOnSameDay_hours() {
        AppointmentData differOnSameDay_hours = new AppointmentData();
        differOnSameDay_hours.title = "differOnSameDay_hours";
        differOnSameDay_hours.description = "Differ by hours";
        differOnSameDay_hours.tz = "America/Chicago";
        differOnSameDay_hours.startDate = "2025-12-01";
        differOnSameDay_hours.startTime = "12:00";
        differOnSameDay_hours.endDate = "2025-12-01";
        differOnSameDay_hours.endTime = "10:00";
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(differOnSameDay_hours),
                "No start or end should throw IllegalArgumentException");
    }
    @Test
    void test_createProduct_fail_differsOnDifferentDay_validTime() {
        AppointmentData differOnDifferentDay_validTime = new AppointmentData();
        differOnDifferentDay_validTime.title = "differOnDifferentDay";
        differOnDifferentDay_validTime.description = "Differ by hours";
        differOnDifferentDay_validTime.tz = "America/Chicago";
        differOnDifferentDay_validTime.startDate = "2025-12-02";
        differOnDifferentDay_validTime.startTime = "10:00";
        differOnDifferentDay_validTime.endDate = "2025-12-01";
        differOnDifferentDay_validTime.endTime = "11:00";
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(differOnDifferentDay_validTime),
                "No start or end should throw IllegalArgumentException");
    }
    @Test
    void test_createProduct_fail_differOnDifferentDay_invalidTime() {
        AppointmentData differOnDifferentDay_invalidTime = new AppointmentData();
        differOnDifferentDay_invalidTime.title = "differOnDifferentDay";
        differOnDifferentDay_invalidTime.description = "Differ by hours";
        differOnDifferentDay_invalidTime.tz = "America/Chicago";
        differOnDifferentDay_invalidTime.startDate = "2025-12-02";
        differOnDifferentDay_invalidTime.startTime = "12:00";
        differOnDifferentDay_invalidTime.endDate = "2025-12-01";
        differOnDifferentDay_invalidTime.endTime = "10:00";
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(differOnDifferentDay_invalidTime),
                "No start or end should throw IllegalArgumentException");


    }

}