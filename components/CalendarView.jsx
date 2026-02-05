"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("edit");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseCard = () => {
    setShowCard(false);
    setLoading(false);
    setEvent(null);
  };

  const fetchEvents = async () => {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const toDateTimeLocal = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const handleSelect = async (info) => {
    const isMonthView = info.view.type === "dayGridMonth";

    let start = info.start;
    let end = info.end;

    if (isMonthView) {
      start = new Date(info.startStr + "T00:00:00");
      end = new Date(info.endStr + "T00:00:00");
    }

    setMode("create");
    setEvent({
      title: "",
      start: toDateTimeLocal(start),
      end: toDateTimeLocal(end || start),
    });
    setShowCard(true);
  };

  const handleEventDrop = async (info) => {
    await fetch(`/api/events/${info.event._def.publicId}`, {
      method: "PUT",
      body: JSON.stringify({
        start: info.event.start,
        end: info.event.end,
      }),
    });
  };

  const handleEventClick = async (info) => {
    setMode("edit");
    setShowCard(true);
    setLoading(true);

    const res = await fetch(`/api/events/${info.event._def.publicId}`, {
      method: "GET",
    });
    const data = await res.json();
    setEvent({
      ...data,
      start: toDateTimeLocal(data.start),
      end: toDateTimeLocal(data.end),
    });
    setLoading(false);
  };

  const handleDeleteEvent = async (id) => {
    await fetch(`/api/events/${id}`, {
          method: "DELETE",
        });

    fetchEvents();
    handleCloseCard();
  }

  const handleUpdateEvent = async (id) => {
    await fetch(`/api/events/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: event.title,
        start: event.start,
        end: event.end,
      }),
    });
    fetchEvents();
    handleCloseCard();
  }

  const handleCreateEvent = async () => {
    if (!event?.title) return;
    await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        title: event.title,
        start: event.start,
        end: event.end,
      }),
    });

    fetchEvents();
    handleCloseCard();
  };

  return (
    <>
      {showCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={handleCloseCard}
        >
          <div
            className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseCard}
              className="absolute right-3 top-3 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              {mode === "create" ? "Create Event" : "Event Info"}
            </h2>

            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              event && (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="title"
                    value={event.title || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Event title"
                  />

                  <input
                    type="datetime-local"
                    name="start"
                    value={event.start || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />

                  <input
                    type="datetime-local"
                    name="end"
                    value={event.end || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />

                  <div className="mt-4 flex justify-end gap-3">
                    {mode === "edit" && (
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    )}

                    {mode === "edit" ? (
                      <button
                        onClick={() => handleUpdateEvent(event.id)}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        onClick={handleCreateEvent}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                      >
                        Create
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}



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

  </>
  );
}
