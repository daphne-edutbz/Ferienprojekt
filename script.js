<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign-Up Calendar</title>

        <!--initialize FullCalendar-->
        <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js'></script>
        <link rel="stylesheet" href="styles.css">
</head>
<body>

    <h1>Shared Sign-Up Calendar </h1>
    <p>Click on a day to add an appointment.</p>

    <div id="calendar"></div>

    <!-- Pop-Up when you click on a date (https://www.w3schools.com/howto/howto_css_modals.asp) -->
    <div id="eventModal" class="modal">
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Add an appointment</h2>
            <form id="eventForm">
                <label for="eventName">Name:</label>
                <input type="text" id="eventName" required>

                <label for="eventTime">Time:</label>
                <input type="time" id="eventTime" required>

                <label for="eventDuration">Duration (hours):</label>
                <input type="number" id="eventDuration" min="1" required>

                <label for="eventColor">Colour:</label>
                <input type="color" id="eventColor" value="#ff6347" required>

                <label for="eventDescription">Description:</label>
                <textarea id="eventDescription" placeholder="Description"></textarea>

                <button type="submit">submit</button>
            </form>
        </div>
    </div> 


<!-- Details Modal (Viewing Event Details) -->
<div id="viewEventModal" class="modal">
    <div class="modal-content">
        <span id="closeViewEventModal" class="close-button">&times;</span> <!-- X-Button -->
        <h2>Details</h2>
        <p><strong>Name:</strong> <span id="viewEventName"></span></p>
        <p><strong>Time & Date:</strong> <span id="viewEventDateTime"></span></p>
        <p><strong>Duration: </strong> <span id="viewEventDuration"></span></p>
        <p><strong>Description:</strong> <span id="viewEventDescription"></span></p>

        <button id="editViewEventBtn">Edit</button>
        <button id="deleteEventBtn">Delete</button>
    </div>
</div>




<!-- edit an exiating appointment -->
<div id="editEventModal" class="modal">
    <div class="modal-content">
        <span class="close-button" id="closeEditModal">&times;</span>
        <h2>Edit appointment</h2>
        <form id="editEventForm">
            <label for="editEventName">Name:</label>
            <input type="text" id="editEventName" required>

            <label for="editEventTime">Time:</label>
            <input type="time" id="editEventTime" required>

            <label for="editEventDuration">Duration (hours):</label>
            <input type="number" id="editEventDuration" min="0" required>

            <label for="editEventColor">Colour:</label>
            <input type="color" id="editEventColor" value="#ff6347" required>

            <label for="editEventDescription">Description:</label>
            <textarea id="editEventDescription" placeholder="Description"></textarea>

            <button type="submit">submit</button>
        </form>
    </div>
</div>


<!-- FullCalendar JS (import calendar) -->
<script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js'></script>
<script src="script.js"></script>

</body>
</html>
