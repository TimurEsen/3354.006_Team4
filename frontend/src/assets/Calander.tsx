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


    /*fetch('/api/products')
        .then(res => res.json())
        .then(data => console.log(data));
*/
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
                {/*controls of calander + month&yr displayed*/}
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

                {/*Day Headings*/}
                <div className={'d-flex text-center p-2'}>
                    {header.map(day => (
                        <div className={'col p-2'}>{day}</div>
                    ))}
                </div>

                {/*Days*/}
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

                                    {/*Event/Booking logic goes here */}
                                    {getEvents()}

                                </div>
                            ))}
                        </div>
                    ))}

                    {/*<div className={'row'}>
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
                    </div>*/}

                </div>


            </div>
        </>

    );
};

export default CalendarGrid;