import React, { useEffect, useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { ko } from "date-fns/locale"; // 한국어 로케일 추가

const StudyPlanner = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Load events from localStorage when the component mounts
    const storedEvents = localStorage.getItem("studyEvents");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    // Save events to localStorage whenever they change
    localStorage.setItem("studyEvents", JSON.stringify(events));
  }, [events]);

  const handleConfirm = (event, action) => {
    // Log the event object to see its structure
    console.log("Event Object:", event);

    // Check for valid start and end times
    const startTime = new Date(event.start);
    const endTime = new Date(event.end);

    // Check if the start and end times are valid Date objects
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      console.error("Invalid time values for event:", event);
      return Promise.reject("Invalid time values");
    }

    if (action === "create") {
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          ...event,
          event_id:
            new Date().getTime() + Math.random().toString(36).substr(2, 9), // Ensure a unique event ID
          start: startTime.toISOString(), // Ensure the correct format is saved
          end: endTime.toISOString(),
        },
      ]);
    } else if (action === "edit") {
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.event_id === event.event_id
            ? {
                ...event,
                start: startTime.toISOString(),
                end: endTime.toISOString(),
              }
            : evt
        )
      );
    } else if (action === "delete") {
      setEvents((prevEvents) =>
        prevEvents.filter((evt) => evt.event_id !== event.event_id)
      );
    }
    return Promise.resolve(event);
  };

  useEffect(() => {
    const button = document.querySelector(".rs__view_navigator") as HTMLElement;
    if (button) {
      button.style.display = "none";
    }
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <Scheduler
        events={events}
        onConfirm={handleConfirm}
        view="Month"
        editable={true}
        deletable={true}
        locale={ko} // 한국어로 설정
      />
    </div>
  );
};

export default StudyPlanner;
