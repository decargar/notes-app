document.addEventListener('DOMContentLoaded', () => {
    const description = document.getElementById('description');
    const title = document.getElementById('title');
    const addNoteBtn = document.getElementById('addNoteBtn');
    const notesContainer = document.getElementById('notesContainer');

    // Load notes from local storage
    loadNotes();

    addNoteBtn.addEventListener('click', addNote);

    function addNote() {
        const noteDescription = description.value.trim();
        const noteTitle = title.value.trim();

        if (noteTitle === '' || noteDescription === '') {
            alert('Title and description cannot be empty');
            return;
        }

        const now = new Date();
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = now.toLocaleDateString(undefined, dateOptions);
        const formattedTime = now.toLocaleTimeString(undefined, timeOptions);

        const note = {
            id: Date.now(),
            title: noteTitle,
            description: noteDescription,
            date: `${formattedDate}, ${formattedTime}`
        };

        saveNoteToLocalStorage(note);
        appendNoteToDOM(note);

        description.value = '';
        title.value = '';
    }

    function appendNoteToDOM(note) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.setAttribute('data-id', note.id);
        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.description}</p>
            <p><small>${note.date}</small></p>
            <button class="delete-btn">&times;</button>
            <button class="edit-btn">Edit</button>
        `;

        const deleteBtn = noteDiv.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteNoteFromLocalStorage(note.id);
            noteDiv.remove();
        });

        const editBtn = noteDiv.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            editNoteFromDOM(note);
        });

        notesContainer.insertBefore(noteDiv, notesContainer.firstChild);
    }

    function saveNoteToLocalStorage(note) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function deleteNoteFromLocalStorage(noteId) {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes = notes.filter(note => note.id !== noteId);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.forEach(note => {
            appendNoteToDOM(note);
        });
    }

    function editNoteFromDOM(note) {
        title.value = note.title;
        description.value = note.description;

        addNoteBtn.textContent = 'Update Note';
        addNoteBtn.removeEventListener('click', addNote);
        addNoteBtn.addEventListener('click', () => updateNote(note.id));
    }

    function updateNote(noteId) {
        const noteDescription = description.value.trim();
        const noteTitle = title.value.trim();

        if (noteTitle === '' || noteDescription === '') {
            alert('Title and description cannot be empty');
            return;
        }

        const now = new Date();
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = now.toLocaleDateString(undefined, dateOptions);
        const formattedTime = now.toLocaleTimeString(undefined, timeOptions);

        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        const noteIndex = notes.findIndex(note => note.id === noteId);
        notes[noteIndex] = {
            id: noteId,
            title: noteTitle,
            description: noteDescription,
            date: `${formattedDate}, ${formattedTime}`
        };
        localStorage.setItem('notes', JSON.stringify(notes));

        notesContainer.innerHTML = '';
        loadNotes();

        description.value = '';
        title.value = '';
        addNoteBtn.textContent = 'Add Note';
        addNoteBtn.removeEventListener('click', updateNote);
        addNoteBtn.addEventListener('click', addNote);
    }
});
