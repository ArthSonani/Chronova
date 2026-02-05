"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";

export default function CalendarView() {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelect = async (info) => {
    const isMonthView = info.view.type === "dayGridMonth";

    let start = info.start;
    let end = info.end;

    if (isMonthView) {
      start = new Date(info.startStr + "T00:00:00");
      end = new Date(info.endStr + "T00:00:00");
    }
  
    const title = prompt("Event title");
    if (!title) return;

    await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        title,
        start,
        end,
      }),
    });

    fetchEvents();
  };

  const handleEventDrop = async (info) => {
    console.log(info);
    await fetch(`/api/events/${info.event._def.publicId}`, {
      method: "PUT",
      body: JSON.stringify({
        start: info.event.start,
        end: info.event.end,
      }),
    });
  };

  const handleEventClick = async (info) => {
    console.log(info);
    if (!confirm("Delete this event?")) return;

    await fetch(`/api/events/${info.event._def.publicId}`, {
      method: "DELETE",
    });

    fetchEvents();
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      events={events}
      selectable
      editable
      select={handleSelect}
      eventDrop={handleEventDrop}
      eventClick={handleEventClick}
      eventColor='#61615e'
      height="60vh"
      selectBackgroundColor="#349924"
    />
  );
}
