/*
import {useState} from 'react';
// We'll use date-fns for easy date manipulation
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
    isSameMonth,
    isToday
} from 'date-fns';


function getEvents(){
    const [events] = useState(
        fetch('/api/products')
        .then(res => res.json())
    );

    console.log(events)
/!*    const daysEvents = events.map();*!/


    return(
        <></>
    )

}
const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const chunked: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
};
const CalendarGrid = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Logic to get all days for the current month's view
    const getCalendarDays = (date: Date) => {
        const startM = startOfMonth(date);
        const endM = endOfMonth(date);
        // Get the start of the week for the first day, and end of the week for the last day
        const startCal = startOfWeek(startM, {weekStartsOn: 0}); // Sunday as start
        const endCal = endOfWeek(endM, {weekStartsOn: 0});

        return eachDayOfInterval({start: startCal, end: endCal});
    };

    const days = getCalendarDays(currentDate);
    const weeks = chunkArray(days, 7);

    const header = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <>

            <div className={'container p-4'}>
                {/!*controls of calander + month&yr displayed*!/}
                <div className={'d-flex justify-content-center p-2'}>
                    <button type="button" className={'btn btn-primary'}
                            onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                        &lt; Prev
                    </button>
                    <h4 className="mb-0 p-2">{format(currentDate, 'MMMM yyyy')}</h4>
                    <button type="button" className={'btn btn-primary'}
                            onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                        Next &gt;
                    </button>
                </div>

                {/!*Day Headings*!/}
                <div className={'d-flex text-center p-2'}>
                    {header.map(day => (
                        <div className={'col p-2'}>{day}</div>
                    ))}
                </div>

                {/!*Days*!/}
                <div className={'calender-grid'}>
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="row no-gutters d-flex">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={dayIndex}
                                    className={`col-sm text-center py-3 border ${
                                        !isSameMonth(day, currentDate) ? 'text-muted bg-light' : ''
                                    } ${isToday(day) ? 'bg-secondary text-white font-weight-bold' : ''}`}
                                    style={{ minHeight: '80px', cursor: 'pointer' }}
                                >
                                    {format(day, 'd')}

                                    {/!*Event/Booking logic goes here *!/}
                                    {getEvents()}

                                </div>
                            ))}
                        </div>
                    ))}

                    {/!*<div className={'row'}>
                        {days.map((day, index) => (
                            <div
                                key={index}
                                className={`col text-center py-3 border ${
                                    !isSameMonth(day, currentDate) ? 'text-muted bg-light' : ''
                                } ${isToday(day) ? 'bg-info text-white font-weight-bold' : ''}`}
                                style={{minHeight: '80px', cursor: 'pointer'}}
                            >
                                {format(day, 'd')}
                                 You would add event display logic here
                            </div>
                        ))}
                    </div>*!/}

                </div>


            </div>
        </>

    );
};

export default CalendarGrid;*/

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

interface ProductEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    description?: string;
}
interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    events: ProductEvent[];
}
// Helper function to get the number of days in a month
const daysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// Helper function to get the first day of the month (0=Sunday, 6=Saturday)
const firstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

// Helper function to check if two dates are the same day
const isSameDay = (d1: Date, d2: Date): boolean => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};
const isEventActiveOnDay = (event: ProductEvent, targetDay: Date): boolean => {

    const targetDayStart = new Date(
        targetDay.getFullYear(),
        targetDay.getMonth(),
        targetDay.getDate()
    );
    const targetDayEnd = new Date(
        targetDay.getFullYear(),
        targetDay.getMonth(),
        targetDay.getDate(),
        23, 59, 59, 999
    );

    const isStartBeforeTargetEnd = event.start.getTime() <= targetDayEnd.getTime();
    const isEndAfterTargetStart = event.end.getTime() >= targetDayStart.getTime();
    return isStartBeforeTargetEnd && isEndAfterTargetStart;
};

const API_URL = '/api/products';
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SimpleProductCalendar: React.FC = () => {
    const [events, setEvents] = useState<ProductEvent[]>([]);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- API FETCHING ---
    const fetchEvents = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(API_URL);
            const rawData = response.data;

            // Transform API data into the required ProductEvent format
            const formattedEvents: ProductEvent[] = rawData.map((item: any) => ({
                id: item.id,
                title: item.name || item.title,
                start: new Date(item.dtstart),
                end: new Date(item.dtend),
                description: item.description,
            }));
            console.log(rawData);

            setEvents(formattedEvents);
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("Failed to load events.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);


    // --- CALENDAR GRID GENERATION LOGIC ---
    const calendarDays = useMemo<CalendarDay[]>(() => {
        const days: CalendarDay[] = [];

        // 1. Calculate start date of the grid (may be in the previous month)
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const numDaysInMonth = daysInMonth(currentDate);
        const firstDay = firstDayOfMonth(currentDate); // 0 (Sun) to 6 (Sat)

        // Start iterating from the previous month to fill the first row
        const startDayIndex = 1 - firstDay;

        for (let i = startDayIndex; i <= numDaysInMonth + (6 - (new Date(year, month, numDaysInMonth).getDay())); i++) {
            const dayDate = new Date(year, month, i);

            // Find events for this specific day
            const dayEvents = events.filter(event => isEventActiveOnDay(event, dayDate));
            if (dayEvents.length > 0) {
                console.log(`Day ${dayDate.toLocaleDateString()} has events:`, dayEvents);
            }

            days.push({
                date: dayDate,
                isCurrentMonth: dayDate.getMonth() === month,
                events: dayEvents,
            });
        }

        return days;
    }, [currentDate, events]);


    // --- NAVIGATION HANDLERS ---
    const changeMonth = (delta: number) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + delta, 1);
            return newDate;
        });
    };

    const currentMonthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // --- RENDERING ---
    if (isLoading) {
        return <div className="alert alert-info mt-4">Loading calendar events...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-4">{error}</div>;
    }

    return (
        <div className="container mt-4">

            {/* HEADER AND NAVIGATION */}
            <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded shadow-sm">
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => changeMonth(-1)}
                >
                    &lt; Previous
                </button>
                <h3 className="h4 m-0">{currentMonthName}</h3>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => changeMonth(1)}
                >
                    Next &gt;
                </button>
            </div>

            {/* CALENDAR GRID */}
            <div className="calendar-grid p-2 border rounded bg-white shadow">
                {/* Day Headers */}
                <div className="d-flex border-bottom text-muted fw-bold">
                    {WEEK_DAYS.map(day => (
                        <div key={day} className="flex-fill text-center p-2">{day}</div>
                    ))}
                </div>

                {/* Days */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {calendarDays.map((day, index) => (
                        <div
                            key={index}
                            className={`calendar-cell border p-1 ${!day.isCurrentMonth ? 'bg-light text-muted' : 'bg-white'}`}
                            style={{ minHeight: '100px', overflow: 'hidden' }}
                        >
                            <div className={`fw-bold mb-1 ${isSameDay(day.date, new Date()) ? 'text-danger' : ''}`}>
                                {day.date.getDate()}
                            </div>

                            {/* Event Display */}
                            {day.events.slice(0, 2).map(event => (
                                <div
                                    key={event.id}
                                    className="badge bg-primary text-wrap text-start w-100 mb-1"
                                    title={event.title}
                                    style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                >
                                    {event.title}
                                </div>
                            ))}
                            {day.events.length > 2 && (
                                <small className="text-secondary">+ {day.events.length - 2} more</small>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SimpleProductCalendar;