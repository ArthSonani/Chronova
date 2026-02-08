"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";

export default function CalendarView() {
  const [isMobile, setIsMobile] = useState(false);
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("edit");
  const [status, setStatus] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
    setStatus("");
  };

  const handleCloseCard = () => {
    setShowCard(false);
    setLoading(false);
    setEvent(null);
  };

  const fetchEvents = async () => {
    const res = await fetch("/api/events", { credentials: "include" });
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
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
    setStatus("");
    setShowCard(true);
  };

  const handleDateClick = (info) => {
    if (info.view.type !== "dayGridMonth") return;

    const start = new Date(info.dateStr + "T00:00:00");
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    setMode("create");
    setEvent({
      title: "",
      start: toDateTimeLocal(start),
      end: toDateTimeLocal(end),
    });
    setStatus("");
    setShowCard(true);
  };

  const handleEventDrop = async (info) => {
    await fetch(`/api/events/${info.event._def.publicId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
    setStatus("");

    const res = await fetch(`/api/events/${info.event._def.publicId}`, {
      method: "GET",
      credentials: "include",
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
          credentials: "include",
        });

    fetchEvents();
    handleCloseCard();
  }

  const handleUpdateEvent = async (id) => {
    const res = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: event.title,
        start: event.start,
        end: event.end,
      }),
    });
    if (!res.ok) {
      setStatus("Update failed.");
      return;
    }
    await fetchEvents();
    handleCloseCard();
  }

  const handleCreateEvent = async () => {
    if (!event?.title || !event?.start) {
      setStatus("Title and start time are required.");
      return;
    }
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: event.title,
        start: event.start,
        end: event.end || event.start,
      }),
    });
    if (!res.ok) {
      setStatus("Creation failed.");
      return;
    }

    await fetchEvents();
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
            className="relative w-full max-w-md rounded-xl bg-white m-4 p-6 shadow-2xl"
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
                  {status && (
                    <div className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                      {status}
                    </div>
                  )}
                  <input
                    type="text"
                    name="title"
                    value={event.title || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Event title"
                  />

                  <input
                    type="datetime-local"
                    name="start"
                    value={event.start || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />

                  <input
                    type="datetime-local"
                    name="end"
                    value={event.end || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />

                  <div className="mt-4 flex flex-col justify-center gap-3">
              

                    {mode === "edit" ? (
                      <>
                        <button
                          onClick={() => handleUpdateEvent(event.id)}
                          className="w-full rounded-md bg-[#171719] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="rounded-md bg-[#d3250b] px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleCreateEvent}
                        className="w-full rounded-md bg-[#222321] px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
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
        initialView="dayGridMonth"
        locale="en-IN"
        views={{
          dayGridMonth: {
            titleFormat: { year: "numeric", month: "long" }
          },
          timeGridWeek: {
            titleFormat: {
              year: "numeric",
              month: "short",
              day: "numeric"
            },
            dayHeaderFormat: {
              weekday: "short",
              day: "numeric"
            }
          },
          timeGridDay: {
            titleFormat: {
              day: "numeric",
              month: "short",
              year: "numeric"
            }
          }
        }}
        headerToolbar={isMobile
          ? {
              left: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay prev,next today",
            }
          : {
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }
        }
        events={events}
        selectable
        editable
        longPressDelay={500}
        selectLongPressDelay={500}
        eventLongPressDelay={500}
        select={handleSelect}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        eventColor='#545454'
        height="auto"
        selectBackgroundColor="#349924"
      />

  </>
  );
}
