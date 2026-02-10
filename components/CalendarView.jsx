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
    const timezoneOffset = new Date().getTimezoneOffset();
    await fetch(`/api/events/${info.event._def.publicId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        start: info.event.start,
        end: info.event.end,
        timezoneOffset,
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
    const timezoneOffset = new Date().getTimezoneOffset();
    const startIso = event?.start ? new Date(event.start).toISOString() : null;
    const endIso = event?.end ? new Date(event.end).toISOString() : null;
    const res = await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: event.title,
        start: startIso,
        end: endIso,
        timezoneOffset,
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
    const timezoneOffset = new Date().getTimezoneOffset();
    const startIso = new Date(event.start).toISOString();
    const endIso = new Date(event.end || event.start).toISOString();
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: event.title,
        start: startIso,
        end: endIso,
        timezoneOffset,
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
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 pt-30">
        <div className="flex flex-col gap-2 px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/60">
            Calendar
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Your schedule at a glance
          </h1>
          <p className="text-sm text-black/70 sm:text-base">
            Click to create events or drag to adjust timings.
          </p>
        </div>

        <div className="rounded-3xl border border-black/20 bg-white p-3 shadow-sm sm:p-5">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="en-IN"
            views={{
              dayGridMonth: {
                titleFormat: { year: "numeric", month: "long" },
              },
              timeGridWeek: {
                titleFormat: {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
                dayHeaderFormat: {
                  weekday: "short",
                  day: "numeric",
                },
              },
              timeGridDay: {
                titleFormat: {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                },
              },
            }}
            headerToolbar={
              isMobile
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
            eventColor="#545454"
            height="auto"
            selectBackgroundColor="#349924"
          />
        </div>
      </section>

      {showCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={handleCloseCard}
        >
          <div
            className="relative m-4 w-full max-w-md rounded-2xl border border-black/20 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseCard}
              className="absolute right-4 top-4 rounded-md border border-black/20 px-2 py-1 text-xs font-semibold text-black/60 transition hover:border-black hover:text-black"
              aria-label="Close"
            >
              Close
            </button>

            <h2 className="mb-4 text-lg font-semibold text-black">
              {mode === "create" ? "Create event" : "Event info"}
            </h2>

            {loading ? (
              <p className="text-sm text-black/60">Loading...</p>
            ) : (
              event && (
                <div className="space-y-3">
                  {status && (
                    <div className="rounded-md border border-black/20 bg-black/5 px-3 py-2 text-xs font-medium text-black">
                      {status}
                    </div>
                  )}
                  <input
                    type="text"
                    name="title"
                    value={event.title || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-black/20 px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Event title"
                  />

                  <input
                    type="datetime-local"
                    name="start"
                    value={event.start || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-black/20 px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />

                  <input
                    type="datetime-local"
                    name="end"
                    value={event.end || ""}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-black/20 px-4 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />

                  <div className="mt-4 flex flex-col gap-3">
                    {mode === "edit" ? (
                      <>
                        <button
                          onClick={() => handleUpdateEvent(event.id)}
                          className="w-full rounded-md border border-black bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="w-full rounded-md border border-black/30 px-4 py-2 text-sm font-medium text-black transition hover:border-black"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleCreateEvent}
                        className="w-full rounded-md border border-black bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black"
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
    </main>
  );
}
