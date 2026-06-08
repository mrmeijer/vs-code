const form = document.getElementById("ticketForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ticket = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        priority: document.getElementById("priority").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        createdUtc: new Date().toISOString()
    };

    try {
        const response = await fetch("/api/ticket", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticket)
        });

        if (!response.ok) {
            throw new Error("Failed");
        }

        message.innerHTML = "✅ Ticket submitted successfully";
        message.style.color = "green";

        form.reset();
    } catch {
        message.innerHTML = "❌ Unable to submit ticket";
        message.style.color = "red";
    }
});