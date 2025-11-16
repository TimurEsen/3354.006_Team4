package com.example.demo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AppointmentData{
    public AppointmentData(){}

    @JsonProperty("title")
    public String title;
    @JsonProperty("description")
    public String description;
    @JsonProperty("tz")
    public String tz;
    @JsonProperty("start-date")
    public String startDate;
    @JsonProperty("start-time")
    public String startTime;
    @JsonProperty("end-date")
    public String endDate;
    @JsonProperty("end-time")
    public String endTime;

    @Override
    public String toString() {
        return "EventIn [title=" + title
                + ", description=" + description
                + ", tz=" + tz
                + ", startDate=" + startDate
                + ", startTime=" + startTime
                + ", endDate=" + endDate
                + ", endTime=" + endTime+ "]";
    }
}
