document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const newNoteForm = document.getElementById("new-note-form");
  const notesDiv = document.getElementById("notes");
  const authDiv = document.getElementById("auth");
  const notesList = document.getElementById("notes-list");
  const logoutButton = document.getElementById("logout");

  let token = localStorage.getItem("token");

  const showNotes = () => {
    authDiv.style.display = "none";
    notesDiv.style.display = "block";
    fetchNotes();
  };

  const showAuth = () => {
    authDiv.style.display = "block";
    notesDiv.style.display = "none";
  };

  if (token) {
    showNotes();
  } else {
    showAuth();
  }
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log(response);
      if (response.ok) {
        alert("Registration successful");
      } else {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      console.log("heyy");
      alert(error.message);
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      token = data.token;
      localStorage.setItem("token", token);
      showNotes();
    } else {
      alert("Login failed");
    }
  });

  newNoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("note-title").value;
    const content = document.getElementById("note-content").value;

    const response = await fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      fetchNotes();
      newNoteForm.reset();
    } else {
      alert("Failed to add note");
    }
  });

  logoutButton.addEventListener("click", () => {
    token = null;
    localStorage.removeItem("token");
    showAuth();
  });

  const fetchNotes = async () => {
    const response = await fetch("/notes", {
      headers: { Authorization: token },
    });

    if (response.ok) {
      const notes = await response.json();
      notesList.innerHTML = "";
      notes.forEach((note) => {
        const noteDiv = document.createElement("div");
        noteDiv.className = "note";
        noteDiv.textContent = note.title;
        notesList.appendChild(noteDiv);
      });
    } else {
      alert("Failed to fetch notes");
    }
  };
});
