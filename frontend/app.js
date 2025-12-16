const API_URL = "/api/messages";

async function load() {
  const res = await fetch(API_URL);
  const data = await res.json();
  document.getElementById("list").innerHTML =
    data.map(m => `<li>${m.content}</li>`).join("");
}

async function send() {
  const content = document.getElementById("msg").value;
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content })
  });
  load();
}

load();
