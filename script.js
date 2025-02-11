document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    let savedEvents = JSON.parse(localStorage.getItem('calendarEvents')) || [];

    // Modal elements (Pop-ups)
    const modal = document.getElementById('eventModal');
    const editModal = document.getElementById('editEventModal');
    const closeButton = document.querySelector('.close-button');
    const closeEditModal = document.getElementById('closeEditModal');
    const eventForm = document.getElementById('eventForm');
    const editEventForm = document.getElementById('editEventForm');
    const eventNameInput = document.getElementById('eventName');
    const eventTimeInput = document.getElementById('eventTime');
    const eventDurationInput = document.getElementById('eventDuration');
    const eventColorInput = document.getElementById('eventColor');
    const editEventNameInput = document.getElementById('editEventName');
    const editEventTimeInput = document.getElementById('editEventTime');
    const editEventDurationInput = document.getElementById('editEventDuration');
    const editEventColorInput = document.getElementById('editEventColor');
    const editEventDescriptionInput = document.getElementById('editEventDescription');
    const deleteEditEventBtn = document.getElementById('deleteEditEventBtn');
    const viewEventModal = document.getElementById('viewEventModal');
    const closeViewEventModal = document.getElementById('closeViewEventModal'); // Close-Button für Details-Modal
    const deleteEventBtn = document.getElementById('deleteEventBtn');
if (deleteEventBtn) {
    deleteEventBtn.addEventListener('click', function () {
        deleteEvent();
    });
} else {
    console.warn("deleteEventBtn nicht gefunden!");
}

closeViewEventModal.addEventListener('click', function () {
    viewEventModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === viewEventModal) {
        viewEventModal.style.display = 'none';
    }
});


    let selectedDate = null;
    let selectedEvent = null;

    
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        editable: true,  // Allow editing events
        eventStartEditable: true,  // Allow changing start time
        eventDurationEditable: true,  // Allow resizing
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        locale: 'en-GB',
        events: savedEvents,

        dateClick: function (info) {
            selectedDate = info.dateStr;
            openModal();
        },


        eventClick: function (info) {
            selectedEvent = info.event;
            
            document.getElementById('viewEventName').textContent = selectedEvent.title;
            
            const eventStart = new Date(selectedEvent.start);
            eventStart.setMinutes(eventStart.getMinutes() - eventStart.getTimezoneOffset());
            document.getElementById('viewEventDateTime').textContent = eventStart.toLocaleString();
// Display duration
        if (selectedEvent.end) {
            const durationHours = (new Date(selectedEvent.end) - new Date(selectedEvent.start)) / (1000 * 60 * 60);
            document.getElementById('viewEventDuration').textContent = `${durationHours} hours`;
        } else {
            document.getElementById('vieweventDuration').textContent = "Unknown";
        }
// Display description
        document.getElementById('viewEventDescription').textContent = selectedEvent.extendedProps.description || "No description";

        document.getElementById('viewEventModal').style.display = 'block';
        },


//saves appointment after dragging 
        eventDrop: function(info) {
            updateEvent(info.event);
        },

        eventResize: function(info) {
            updateEvent(info.event);
        }
});


function updateEvent(event) {
    savedEvents = savedEvents.map(e => 
        e.id === event.id 
        ? { ...e, start: event.start.toISOString(), end: event.end.toISOString() }
        : e
    );
    localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));
}

        
    calendar.render();
    

    // Modal/Pop-up functions
    function openModal() {
        document.querySelector("#eventModal h2").textContent = `Add an appointment (${selectedDate})`;
        modal.style.display = 'block';
    }
    

    function closeModal() {
        modal.style.display = 'none';
        eventForm.reset();
    }

    function openEditModal(event) {
        editEventNameInput.value = event.title;
        
        const eventStart = new Date(event.start);
        eventStart.setMinutes(eventStart.getMinutes() - eventStart.getTimezoneOffset());
        editEventTimeInput.value = eventStart.toISOString().substring(11, 16);
        
        if (event.end) {
            editEventDurationInput.value = (new Date(event.end) - new Date(event.start)) / (1000 * 60 * 60); 
        }
    
        editEventColorInput.value = event.backgroundColor || "#ff6347"; 
        editEventDescriptionInput.value = event.extendedProps.description || '';
    
        editModal.style.display = 'block';
    }
    
    function closeEditModalFunc() {
        editModal.style.display = 'none';
    }

    //close pop-up
    closeButton.addEventListener('click', closeModal);
    closeEditModal.addEventListener('click', closeEditModalFunc);

    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
        if (event.target === editModal) closeEditModalFunc();
    });

    //save new appointment
    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();

    const eventName = eventNameInput.value;
    const eventTime = eventTimeInput.value;
    const eventDuration = parseInt(eventDurationInput.value, 10) || 1;
    const eventColor = eventColorInput.value;
    const eventDescription = document.getElementById('eventDescription').value;

    if (!eventName || !eventTime || !selectedDate || !eventDuration || !eventColor) {
        alert('Please fill out all fields');
        return;
    }
    const eventStartDate = new Date(`${selectedDate}T${eventTime}:00`);
    const eventEndDate = new Date(eventStartDate.getTime() + (eventDuration * 60 * 60 * 1000));

    if (isOverlapping({ start: eventStartDate, end: eventEndDate })) {
        alert('The date overlaps with an existing appointment.');
        return;
    }

    const newEvent = {
        id: crypto.randomUUID(),
        title: eventName,
        start: eventStartDate.toISOString(),
        end: eventEndDate.toISOString(),
        color: eventColor,
        extendedProps: {
            description: eventDescription,
            duration: eventDuration
        }
    };

    calendar.addEvent(newEvent);
    savedEvents.push(newEvent);
    localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));

    closeModal();
});


    //edit appointment
    editEventForm.addEventListener('submit', function (e) {
        e.preventDefault();
    
        if (!selectedEvent) return;
    
        const editedEventName = editEventNameInput.value;
        const editedEventTime = editEventTimeInput.value;
        const editedEventDuration = parseInt(editEventDurationInput.value, 10) || 1;
        const editedEventColor = editEventColorInput.value;
        const editedEventDescription = editEventDescriptionInput.value;
    
        if (!editedEventName || !editedEventTime || !editedEventDuration || !editedEventColor) {
            alert('Please fill in all fields!');
            return;
        }
    
        const editedEventStartDate = new Date(`${selectedEvent.start.toISOString().split('T')[0]}T${editedEventTime}`);
        const editedEventEndDate = new Date(editedEventStartDate.getTime() + (editedEventDuration * 60 * 60 * 1000));
    
        selectedEvent.setProp('title', editedEventName);
        selectedEvent.setStart(editedEventStartDate);
        selectedEvent.setEnd(editedEventEndDate);
        selectedEvent.setProp('color', editedEventColor);
        selectedEvent.setExtendedProp('description', editedEventDescription);
    
        savedEvents = savedEvents.map(event => 
            event.id === selectedEvent.id 
            ? { 
                ...event, 
                title: editedEventName, 
                start: editedEventStartDate.toISOString(), 
                end: editedEventEndDate.toISOString(), 
                color: editedEventColor, 
                extendedProps: { 
                    description: editedEventDescription,
                    duration: editedEventDuration
                }
            }
            : event
        );
    
        localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));
    
        closeEditModalFunc();
    });

    document.getElementById('editViewEventBtn').addEventListener('click', function () {
        if (!selectedEvent) return;
    
        document.getElementById('editEventName').value = selectedEvent.title;
        
        const eventStart = new Date(selectedEvent.start);
        eventStart.setMinutes(eventStart.getMinutes() - eventStart.getTimezoneOffset());
        document.getElementById('editEventTime').value = eventStart.toISOString().substring(11, 16);
        
        document.getElementById('editEventDuration').value = (selectedEvent.end - selectedEvent.start) / (1000 * 60 * 60);
        document.getElementById('editEventColor').value = selectedEvent.backgroundColor || "#ff6347";
        document.getElementById('editEventDescription').value = selectedEvent.extendedProps.description || '';
    
        document.getElementById('editEventModal').style.display = 'block';
        document.getElementById('viewEventModal').style.display = 'none'; // Hide details modal
    });
    
    
    const deleteViewEventBtn = document.getElementById('deleteViewEventBtn');
    if (deleteViewEventBtn) {
        deleteViewEventBtn.addEventListener('click', function () {
            deleteEvent();
            document.getElementById('viewEventModal').style.display = 'none';
        });
    }

        //delete appointment
        deleteEventBtn.addEventListener('click', function () {
            deleteEvent();
        
    });

deleteEditEventBtn.addEventListener('click', function () {
        deleteEvent();
});

    
    function deleteEvent() {
        if (!selectedEvent) {
            alert("No event selected to delete.");
            return;
        }
    
        // Remove event from calendar
        selectedEvent.remove();
    
        // Remove event from saved events array
        savedEvents = savedEvents.filter(event => event.id !== selectedEvent.id);
    
        // Update localStorage
        localStorage.setItem('calendarEvents', JSON.stringify(savedEvents));
    
        // Close modals
        closeEditModalFunc();
        document.getElementById('viewEventModal').style.display = 'none';
    }
    
// Check for overlapping events
function isOverlapping(newEvent) {
    return savedEvents.some(event => {
        const existingEventStart = new Date(event.start);
        const existingEventEnd = new Date(event.end);

        return (newEvent.start < existingEventEnd && newEvent.end > existingEventStart);
    });
}

// Function to save an event in Firestore
function saveEvent(event) {
    db.collection("events").add({
      title: event.title,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      color: event.backgroundColor,
      description: event.extendedProps.description
    }).then(() => {
      console.log("Event successfully saved to Firestore");
    }).catch((error) => {
      console.error("Error saving event: ", error);
    });
  }
  
// Function to load and display events from Firestore
function loadEvents() {
    db.collection("events").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        // Add event to FullCalendar
        calendar.addEvent({
          title: eventData.title,
          start: eventData.start,
          end: eventData.end,
          color: eventData.color,
          extendedProps: {
            description: eventData.description
          }
        });
      });
    });
  }
  
// Function to delete an event
function deleteEvent(eventId) {
    db.collection("events").doc(eventId).delete()
      .then(() => {
        console.log("Event deleted");
      }).catch((error) => {
        console.error("Error deleting event: ", error);
      });
  }
  


});
