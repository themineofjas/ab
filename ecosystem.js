"use strict";

// Fictional demonstration data. These are not registered accounts or dial codes.
const creators = [
  { id: "alex", name: "Alex Morgan", code: "A7M-4R2", initials: "AM", color: "#101d36", roles: "Filmmaker / Creative producer", bio: "I make films about the ordinary moments that become part of our collective memory.", making: "An independent short film about friendship, ambition, and a neighborhood in transition.", seeking: "A costume designer who enjoys character-led storytelling.", interests: "Independent cinema, community archives, music, and beautifully worn objects.", symbols: "✦  ✎  ♫  ◇", availability: "Seeking collaborators" },
  { id: "nia", name: "Nia Brooks", code: "N8V-2K6", initials: "NB", color: "#a31342", roles: "Illustrator / Editorial designer", bio: "I build visual worlds where illustration, fashion, and everyday stories meet.", making: "A small independent magazine about the places that shape us.", seeking: "Writers, photographers, and people with a story to share.", interests: "Print culture, fashion history, local bookstores, and visual storytelling.", symbols: "✧  ✎  ◈  ☀", availability: "Available for paid work" },
  { id: "sol", name: "Sol Rivera", code: "S4R-7T2", initials: "SR", color: "#005246", roles: "Sound designer / Workshop facilitator", bio: "I turn listening into an invitation to make something together.", making: "A series of hands-on sound workshops for emerging creatives.", seeking: "A photographer to document the first workshop.", interests: "Field recordings, collaborative learning, radio, and public spaces.", symbols: "✦  ♫  ≋  ✧", availability: "Open to conversation" }
];

const projects = [
  { id: "film-001", creator: "alex", title: "Short film / Seeking a costume designer", kind: "Film", type: "Paid opportunity", description: "Help shape the characters' visual identities for a three-day independent film shoot.", need: "Costume design", status: "open", published: "2026-10-07" },
  { id: "mag-002", creator: "nia", title: "Independent magazine / Photo essay", kind: "Editorial", type: "Collaboration", description: "Build a photo essay about a place that changed how you see your city. Scope and terms to be agreed together.", need: "Photography + writing", status: "open", published: "2026-10-06" },
  { id: "sound-003", creator: "sol", title: "Sound workshop / Event photographer", kind: "Music & learning", type: "Paid opportunity", description: "Document people experimenting, listening, and making at a small creative workshop.", need: "Event photography", status: "open", published: "2026-10-05" },
  { id: "film-004", creator: "alex", title: "Neighborhood stories / Research partner", kind: "Film", type: "Collaboration", description: "Explore local oral histories and develop questions for a future documentary.", need: "Research + interviewing", status: "open", published: "2026-10-04" },
  { id: "mag-005", creator: "nia", title: "Cover study / Finished edition", kind: "Editorial", type: "Collaboration", description: "An archived cover exploration. This project is complete and is no longer accepting inquiries.", need: "Illustration", status: "closed", published: "2026-09-15" }
];

const storageKey = "artist-ecosystem-demo-v1";
let state = { inquiries: [], workspace: [] };
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
  if (saved && Array.isArray(saved.inquiries) && Array.isArray(saved.workspace)) state = saved;
} catch { storageAvailable = false; }

const main = document.getElementById("main");
const creatorById = id => creators.find(person => person.id === id);
const projectById = id => projects.find(project => project.id === id);
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const formatDate = value => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
let statusTimer;

function notify(message) {
  document.getElementById("status").textContent = message;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { document.getElementById("status").textContent = ""; }, 4500);
}

function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); }
  catch { storageAvailable = false; }
  document.getElementById("inquiry-count").textContent = state.inquiries.length;
}

function activeProjects(creatorId) {
  return projects.filter(project => project.creator === creatorId && project.status === "open")
    .sort((a, b) => b.published.localeCompare(a.published));
}

function projectCard(project) {
  const person = creatorById(project.creator);
  return `<article class="project-card">
    <span class="project-kind">${escapeHTML(project.kind)} / ${project.status === "open" ? "OPEN" : "CLOSED"}</span>
    <h3>${escapeHTML(project.title)}</h3>
    <p>${escapeHTML(project.description)}</p>
    <div class="project-meta"><span class="chip">${escapeHTML(project.type)}</span><span class="chip">${escapeHTML(project.need)}</span></div>
    <button class="creator-link" data-profile="${person.id}">${escapeHTML(person.name)} / ${person.code}</button>
    ${project.status === "open" ? `<button class="button" data-identity="${person.id}" data-project="${project.id}">Meet the creator ↗</button>` : `<span class="help">Archived / Inquiries closed</span>`}
  </article>`;
}

function creatorTile(person) {
  return `<a class="creator-tile" href="#profile/${person.id}">
    <div class="avatar" style="background:${person.color}">${person.initials}</div>
    <h3>${escapeHTML(person.name)}</h3><p>${escapeHTML(person.roles)}</p>
    <p>${escapeHTML(person.availability)}</p><code>${person.code}</code>
  </a>`;
}

function identityCard(person, modal = false) {
  return `<div class="identity-card" style="background:${person.color}">
    <p class="eyebrow">CREATIVE ID / FICTIONAL MEMBER</p><h2${modal ? ' id="identity-title"' : ""}>${escapeHTML(person.name)}</h2>
    <p>${escapeHTML(person.roles)}</p><div class="symbols" aria-label="Selected personal symbols">${person.symbols}</div>
    <p>${escapeHTML(person.availability)}</p><div class="dial-code">${person.code}</div>
  </div>`;
}

function renderDiscover() {
  main.innerHTML = `<section class="hero"><div>
    <p class="eyebrow">A place for creative lives to meet.</p><h1>Find your people.<br>Make your next thing.</h1>
    <p class="lead">An expressive profile. A portable introduction. A board full of possibilities. A place to turn a connection into work.</p>
    <div class="actions"><a class="button" href="#board">Explore the bulletin board ↗</a><a class="button secondary" href="#dial">Dial a creator</a></div>
    </div><div class="identity-stage">${identityCard(creators[0])}</div></section>
    <section><div class="section-head"><h2>What could we make together?</h2><a href="#board">View the board ↗</a></div>
    <div class="grid">${projects.filter(p => p.status === "open").slice(0, 3).map(projectCard).join("")}</div></section>
    <section><div class="section-head"><h2>More than a job title.</h2><span class="eyebrow">Meet three fictional creators</span></div>
    <div class="grid">${creators.map(creatorTile).join("")}</div></section>
    <section><div class="section-head"><h2>From introduction to action.</h2><a href="./creative-id.html">Design your physical ID ↗</a></div>
    <div class="steps"><article><p class="eyebrow">01 / EXPRESS</p><h3>A little more of you.</h3><p>Your work, interests, and chosen stories live together on your profile.</p></article>
    <article><p class="eyebrow">02 / CONNECT</p><h3>A reason to reach out.</h3><p>Discover a project, dial its creator, and start with a clear subject.</p></article>
    <article><p class="eyebrow">03 / MAKE</p><h3>A visible next step.</h3><p>Bring the project into a workspace. Use an agendabook alongside it.</p></article></div></section>`;
}

function renderBoard() {
  main.innerHTML = `<section class="page-head"><p class="eyebrow">THE BULLETIN BOARD</p><h1>Someone has an idea.<br>You have something to bring.</h1><p class="lead">Browse fictional project requests. Each inquiry keeps the project attached, so conversations have a clear starting point.</p></section>
    <div class="filters"><div><label for="board-search">Search projects or skills</label><input id="board-search" type="search" placeholder="Try costume, photography, or research"></div>
    <div><label for="board-type">Opportunity type</label><select id="board-type"><option value="all">All opportunities</option><option>Paid opportunity</option><option>Collaboration</option></select></div>
    <div><label for="board-status">Project status</label><select id="board-status"><option value="open">Open projects</option><option value="all">Include archived projects</option></select></div></div>
    <p class="help" id="board-count" role="status"></p><div class="grid" id="board-results"></div>`;
  ["board-search", "board-type", "board-status"].forEach(id => document.getElementById(id).addEventListener("input", filterBoard));
  filterBoard();
}

function filterBoard() {
  const query = document.getElementById("board-search").value.trim().toLowerCase();
  const type = document.getElementById("board-type").value;
  const status = document.getElementById("board-status").value;
  const matches = projects.filter(p => (status === "all" || p.status === status) && (type === "all" || p.type === type) && `${p.title} ${p.description} ${p.need} ${creatorById(p.creator).name}`.toLowerCase().includes(query));
  document.getElementById("board-count").textContent = `${matches.length} sample project${matches.length === 1 ? "" : "s"}`;
  document.getElementById("board-results").innerHTML = matches.length ? matches.map(projectCard).join("") : '<p class="empty">No matching sample projects. Try another search.</p>';
}

function renderProfile(id, showAll = false) {
  const person = creatorById(id);
  if (!person) return renderDiscover();
  const all = projects.filter(p => p.creator === id).sort((a, b) => b.published.localeCompare(a.published));
  const latest = showAll ? all : activeProjects(id).slice(0, 5);
  main.innerHTML = `<div class="profile-layout"><aside class="profile-aside" style="background:${person.color}">
    <p class="eyebrow">CREATIVE ID / SAMPLE PROFILE</p><h2>${escapeHTML(person.name)}</h2><p>${escapeHTML(person.roles)}</p>
    <div class="symbols">${person.symbols}</div><p>${escapeHTML(person.availability)}</p><div class="dial-code">${person.code}</div>
    <button class="button" data-identity="${id}">Message this creator ↗</button><a href="./creative-id.html">Explore the physical Creative ID</a></aside>
    <section><p class="eyebrow">MEET THE PERSON / MEET THE WORK</p><h1>Making room<br>for possibility.</h1><p class="lead">${escapeHTML(person.bio)}</p>
    <div class="profile-details"><article><h3>I’m making.</h3><p>${escapeHTML(person.making)}</p></article><article><h3>I’m looking for.</h3><p>${escapeHTML(person.seeking)}</p></article><article><h3>Beyond the work.</h3><p>${escapeHTML(person.interests)}</p></article><article><h3>A stable introduction.</h3><p>Dial ${person.code} to find this sample identity. A future registered code would stay the same when projects or links change.</p></article></div>
    <div class="section-head"><h2>${showAll ? "All sample projects." : "Latest active projects."}</h2><button class="text-button" data-all-projects="${id}">${showAll ? "Show latest active" : "View all projects"}</button></div>
    <p class="help">The latest five active projects appear automatically, newest first. Closed work remains in the archive.</p>
    <div class="profile-projects">${latest.length ? latest.map(projectCard).join("") : '<p class="empty">No active sample projects.</p>'}</div></section></div>`;
  main.dataset.allProjects = String(showAll);
}

function renderDial() {
  main.innerHTML = `<section class="page-head"><p class="eyebrow">THE INTERNET PHONEBOOK / A DESIGN EXPLORATION</p><h1>A code.<br>A person.<br>A possibility.</h1></section>
    <div class="dial-layout"><form class="dial-form" id="dial-form"><label for="dial-input">Enter a creator’s dial code</label><input id="dial-input" placeholder="A7M-4R2" maxlength="12" autocapitalize="characters" spellcheck="false" required aria-describedby="dial-help">
    <p class="help" id="dial-help">Uppercase or lowercase. With or without the hyphen. This demo recognizes the three fictional codes below.</p>
    <div class="example-codes">${creators.map(p => `<button type="button" data-code="${p.code}">${p.code}</button>`).join("")}</div>
    <button class="button" type="submit">Find the identity card ↗</button><p id="dial-result" role="status" class="help"></p></form>
    <section><h2>See a posting.<br>Meet its creator.</h2><p class="lead">A physical bulletin can show this personal code. A project-specific QR code could open the same identity with the right project already selected.</p><p class="help">A dial code is a directory address, not a phone number. Looking someone up shows their identity before opening a message composer.</p><a class="text-button" href="#board">Try a project posting instead ↗</a></section></div>`;
  document.getElementById("dial-form").addEventListener("submit", event => {
    event.preventDefault();
    const code = document.getElementById("dial-input").value.replace(/[-\s]/g, "").toUpperCase();
    const person = creators.find(p => p.code.replace("-", "") === code);
    if (person) openIdentity(person.id);
    else document.getElementById("dial-result").textContent = "That code is not in this sample directory. Try one of the three example codes.";
  });
}

function openIdentity(id, projectId = "") {
  const person = creatorById(id);
  if (!person) return;
  const project = projectById(projectId);
  document.getElementById("identity-content").innerHTML = `${identityCard(person, true)}
    ${project ? `<div class="identity-project"><strong>About this project</strong><p>${escapeHTML(project.title)}</p></div>` : ""}
    <div class="actions"><button class="button" data-compose="${id}" data-project="${project ? project.id : ""}">Message ↗</button><button class="button secondary" data-full-profile="${id}">View full profile</button></div>
    <p class="help">Confirm the person before starting a conversation. This is a fictional profile.</p>`;
  document.getElementById("identity-dialog").showModal();
}

function subjectFor(projectId) {
  const project = projectById(projectId);
  return project ? `Project inquiry · ${project.title}` : "General inquiry";
}

function openComposer(id, projectId = "") {
  const person = creatorById(id);
  if (!person) return;
  document.getElementById("identity-dialog").close();
  document.getElementById("recipient-id").value = id;
  document.getElementById("message-title").textContent = `Contact ${person.name}.`;
  const select = document.getElementById("message-project");
  select.innerHTML = '<option value="">General inquiry</option>' + activeProjects(id).map(p => `<option value="${p.id}">${escapeHTML(p.title)}</option>`).join("");
  select.value = activeProjects(id).some(p => p.id === projectId) ? projectId : "";
  document.getElementById("message-subject").value = subjectFor(select.value);
  document.getElementById("message-body").value = "";
  document.getElementById("message-dialog").showModal();
}

function renderInbox() {
  const options = [...new Set(state.inquiries.map(i => i.project || "general"))].map(id => `<option value="${id}">${escapeHTML(id === "general" ? "General inquiries" : projectById(id)?.title || "Unknown project")}</option>`).join("");
  main.innerHTML = `<section class="page-head"><p class="eyebrow">YOUR LOCAL DEMO INQUIRIES</p><h1>Every conversation<br>has a starting point.</h1><p class="lead">Sample inquiries are grouped by their attached project. Subjects are generated automatically. Nobody receives these messages.</p></section>
    <div class="filters"><div><label for="inquiry-filter">Filter by project</label><select id="inquiry-filter"><option value="all">All inquiries</option>${options}</select></div></div><div class="list" id="inquiry-list"></div>`;
  document.getElementById("inquiry-filter").addEventListener("change", renderInquiryList);
  renderInquiryList();
}

function renderInquiryList() {
  const filter = document.getElementById("inquiry-filter").value;
  const items = state.inquiries.filter(i => filter === "all" || (i.project || "general") === filter);
  document.getElementById("inquiry-list").innerHTML = items.length ? items.map(i => {
    const person = creatorById(i.recipient);
    const project = projectById(i.project);
    if (!person) return "";
    return `<article class="inquiry"><p class="eyebrow">DEMO ONLY / TO ${escapeHTML(person.name)} / ${formatDate(i.created)}</p><h3>${escapeHTML(i.subject)}</h3><p class="message-copy">${escapeHTML(i.body)}</p>
      <div class="actions">${project ? `<button class="button secondary" data-add-workspace="${project.id}">Add sample project to workspace ↗</button>` : ""}<button class="text-button" data-profile="${person.id}">View creator</button></div></article>`;
  }).join("") : '<div class="empty">No sample inquiries here yet. <a href="#board">Explore a project</a>, meet its creator, and save a demo inquiry.</div>';
}

function addWorkspace(projectId) {
  if (!projectById(projectId)) return;
  if (state.workspace.some(item => item.project === projectId)) return notify("That sample project is already in your workspace.");
  state.workspace.push({ project: projectId, tasks: [
    { text: "Clarify the idea and what each person brings", done: false },
    { text: "Agree on scope, timing, and terms", done: false },
    { text: "Choose the first concrete next step", done: false }
  ] });
  persist();
  location.hash = "workspace";
  notify("Added to your demo workspace. This does not confirm a collaboration.");
}

function renderWorkspace() {
  main.innerHTML = `<section class="page-head"><p class="eyebrow">THE WORKSPACE / LOCAL DEMO</p><h1>Make the next<br>step visible.</h1><p class="lead">Turn a sample connection into a simple plan. Adding a project here does not accept an offer or create a shared workspace.</p><div class="actions"><a class="button secondary" href="./index.html#collection">Explore the agendabook ↗</a><a class="text-button" href="#inbox">Back to inquiries</a></div></section>
    <div class="list">${state.workspace.length ? state.workspace.map(item => {
      const project = projectById(item.project);
      if (!project) return "";
      const done = item.tasks.filter(t => t.done).length;
      return `<article class="workspace-card"><p class="eyebrow">WITH ${escapeHTML(creatorById(project.creator).name)} / SAMPLE PLAN</p><h3>${escapeHTML(project.title)}</h3><p class="progress">${done} of ${item.tasks.length} steps complete</p>
      ${item.tasks.map((task, index) => `<label class="task ${task.done ? "done" : ""}"><input type="checkbox" data-task="${index}" data-workspace="${project.id}" ${task.done ? "checked" : ""}><span>${escapeHTML(task.text)}</span></label>`).join("")}
      <div class="workspace-actions"><button class="text-button" data-identity="${project.creator}" data-project="${project.id}">View creator and project</button><button class="text-button" data-remove-workspace="${project.id}">Remove from demo workspace</button></div></article>`;
    }).join("") : '<div class="empty">No projects yet. Save a <a href="#board">project inquiry</a>, then add its sample project from the Inquiries page.</div>'}</div>`;
}

function renderRoute(moveFocus = false) {
  const [route = "discover", id] = location.hash.slice(1).split("/");
  document.querySelectorAll("[data-route]").forEach(link => {
    if (link.dataset.route === route) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  main.removeAttribute("data-all-projects");
  const titles = { discover: "Discover", board: "Bulletin Board", profile: "Creative Profile", dial: "Dial a Creator", inbox: "Inquiries", workspace: "Workspace" };
  document.title = `${titles[route] || "Discover"} — ARTIST`;
  if (route === "board") renderBoard();
  else if (route === "profile") renderProfile(id);
  else if (route === "dial") renderDial();
  else if (route === "inbox") renderInbox();
  else if (route === "workspace") renderWorkspace();
  else renderDiscover();
  if (moveFocus) { main.focus({ preventScroll: true }); window.scrollTo(0, 0); }
}

document.addEventListener("click", event => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.close) document.getElementById(target.dataset.close).close();
  if (target.dataset.profile) location.hash = `profile/${target.dataset.profile}`;
  if (target.dataset.identity) openIdentity(target.dataset.identity, target.dataset.project);
  if (target.dataset.compose) openComposer(target.dataset.compose, target.dataset.project);
  if (target.dataset.fullProfile) { document.getElementById("identity-dialog").close(); location.hash = `profile/${target.dataset.fullProfile}`; }
  if (target.dataset.code) { document.getElementById("dial-input").value = target.dataset.code; document.getElementById("dial-input").focus(); }
  if (target.dataset.allProjects) renderProfile(target.dataset.allProjects, main.dataset.allProjects !== "true");
  if (target.dataset.addWorkspace) addWorkspace(target.dataset.addWorkspace);
  if (target.dataset.removeWorkspace) { state.workspace = state.workspace.filter(item => item.project !== target.dataset.removeWorkspace); persist(); renderWorkspace(); }
});

document.addEventListener("change", event => {
  if (!event.target.matches("[data-task]")) return;
  const item = state.workspace.find(item => item.project === event.target.dataset.workspace);
  if (!item) return;
  item.tasks[Number(event.target.dataset.task)].done = event.target.checked;
  persist();
  event.target.closest("label").classList.toggle("done", event.target.checked);
  event.target.closest("article").querySelector(".progress").textContent = `${item.tasks.filter(t => t.done).length} of ${item.tasks.length} steps complete`;
});

document.getElementById("message-project").addEventListener("change", event => {
  document.getElementById("message-subject").value = subjectFor(event.target.value);
});

document.getElementById("message-form").addEventListener("submit", event => {
  event.preventDefault();
  const body = document.getElementById("message-body").value.trim();
  if (!body) { document.getElementById("message-body").focus(); return; }
  const projectId = document.getElementById("message-project").value;
  state.inquiries.unshift({ recipient: document.getElementById("recipient-id").value, project: projectId, subject: subjectFor(projectId), body, created: new Date().toISOString() });
  persist();
  document.getElementById("message-dialog").close();
  if (location.hash === "#inbox") renderInbox(); else location.hash = "inbox";
  notify(storageAvailable ? "Demo inquiry saved in this browser. No message was sent." : "Demo inquiry saved for this session. No message was sent.");
});

document.getElementById("reset-demo").addEventListener("click", () => {
  if (!confirm("Remove all sample inquiries and workspace tasks from this browser?")) return;
  state = { inquiries: [], workspace: [] };
  persist();
  renderRoute();
  notify("Demo data reset.");
});

window.addEventListener("hashchange", () => renderRoute(true));
persist();
renderRoute();
