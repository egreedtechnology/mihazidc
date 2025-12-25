import React, { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Badge } from "@/components/ui/badge";

const localizer = momentLocalizer(moment);

export default function AppointmentCalendar({ appointments = [], onSelectEvent }) {
  const events = useMemo(() => {
    return appointments.map(apt => {
      const date = apt.date;
      const [hours, minutes] = apt.time.split(':');
      const start = new Date(`${date}T${apt.time}:00`);
      const [endHours, endMinutes] = apt.end_time?.split(':') || [hours, minutes];
      const end = new Date(`${date}T${apt.end_time || apt.time}:00`);

      return {
        id: apt.id,
        title: `${apt.patient_name} - ${apt.service_name}`,
        start,
        end,
        resource: apt,
      };
    });
  }, [appointments]);

  const eventStyleGetter = (event) => {
    const apt = event.resource;
    let backgroundColor = '#0D9488'; // teal-600
    
    switch(apt.status) {
      case 'pending':
        backgroundColor = '#F59E0B'; // amber-500
        break;
      case 'confirmed':
        backgroundColor = '#0D9488'; // teal-600
        break;
      case 'completed':
        backgroundColor = '#10B981'; // green-500
        break;
      case 'cancelled':
        backgroundColor = '#EF4444'; // red-500
        break;
      case 'no_show':
        backgroundColor = '#6B7280'; // gray-500
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
        fontSize: '13px',
        padding: '2px 6px'
      }
    };
  };

  const CustomEvent = ({ event }) => {
    const apt = event.resource;
    return (
      <div className="p-1">
        <div className="font-semibold text-xs truncate">{apt.patient_name}</div>
        <div className="text-xs truncate">{apt.service_name}</div>
        <div className="text-xs">{apt.time}</div>
      </div>
    );
  };

  return (
    <div className="h-[600px] bg-white rounded-lg p-4 shadow-sm">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={(event) => onSelectEvent(event.resource)}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CustomEvent
        }}
        views={['month', 'week', 'day', 'agenda']}
        defaultView="month"
        step={30}
        showMultiDayTimes
        popup
      />
      
      <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs text-gray-600">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-600" />
          <span className="text-xs text-gray-600">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600">Cancelled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-xs text-gray-600">No Show</span>
        </div>
      </div>
    </div>
  );
}
