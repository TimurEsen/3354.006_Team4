package com.example.demo;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProductControllerTest {

    @Test
    void test_createProduct_fail(){
        //* Catches no title passed
        AppointmentData titleNull = new AppointmentData();
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(titleNull),
                "Null title should throw IllegalArgumentException");
        AppointmentData titleEmpty = new AppointmentData();
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(titleEmpty),
                "Empty title should throw IllegalArgumentException");

        //* Catches no Start or End passed
        AppointmentData noStart = new AppointmentData();
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(noStart),
                "No start should throw IllegalArgumentException");
        AppointmentData noEnd = new AppointmentData();
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(noEnd),
                "No end should throw IllegalArgumentException");
        AppointmentData noStartorEnd = new AppointmentData();
        assertThrows(IllegalArgumentException.class, () -> new ProductController().createProduct(noStartorEnd),
                "No start or end should throw IllegalArgumentException");

        //* Catches Start time set after End

    }

}