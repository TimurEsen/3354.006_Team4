package com.example.demo;
import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;


@Entity
public class Events {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // Time of creation/last update
    @CreatedDate
    @Column(name = "dtstamp")
    private Instant dtstamp;

    // Start of event
    @Column(name = "dtstart")
    private Instant dtstart;

    // End of event
    @Column(name = "dtend")
    private Instant dtend;


    // Title of the event
    @Column(name = "summary")
    private String title;

    // Descriptions or extra information
    @Column(name = "description")
    private String description;


    public  Events() {}
    public Events(Instant dtstart, Instant dtend, String title, String description) {
        //id = UUID.randomUUID();
        //dtstamp = Instant.now();
        this.dtstart = dtstart;
        this.dtend = dtend;
        this.title = title;
        this.description = description;
    }

    public UUID getID(){
        return id;
    }
    public Instant  getDtstamp(){
        return dtstamp;
    }
    public Instant getDtstart(){
        return dtstart;
    }
    public Instant getDtend(){
        return dtend;
    }
    public String getTitle(){
        return title;
    }
    public String getDescription(){
        return description;
    }



}
