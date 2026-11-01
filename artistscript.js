// 1. DATA REPOSITORY: Your curated digital garden elements
const gardenData = [
    {
        id: "clip-1",
        type: "Quote / Text Clipping",
        typeClass: "bg-amber-50 text-amber-700 border-amber-200",
        source: "The Agile Creator Manifesto",
        platform: "via Substack",
        content: '"I operate on an agile production model. I don\'t build monuments; I ship Capsules. Every rapid era is a themed version drop. When the sprint closes, the catalog locks."',
        meta: "⌥ Remixed 3x"
    },
    {
        id: "clip-2",
        type: "Visual Identity",
        typeClass: "bg-purple-50 text-purple-700 border-purple-200",
        source: "Color Profile Anchor",
        platform: "Instagram Feed Layer",
        content: "[Aesthetic Stem: 3D Glitch Render Loop .mp4] <br><br>Color configuration profile anchor for Era 04. Blending deep violet (#2a0845) with retro CRT neon scan lines.",
        meta: "★ Active Asset"
    },
    {
        id: "clip-3",
        type: "Theory / Research Link",
        typeClass: "bg-blue-50 text-blue-700 border-blue-200",
        source: "Stuart Brown's Archetypes of Play",
        platform: "via Wikipedia",
        content: "Analyzing the structural, thematic overlaps between the 'Explorer' play profile and modern agile software versioning deployment cycles.",
        meta: "★ Starred v1.2"
    }
];

const catalogData = [
    {
        id: "era-03",
        number: "03",
        title: "Capsule: Brutalist Ecologies",
        version: "v1.0.4",
        badge: "",
        description: "3 Singles Drop · Blending concrete architecture frameworks with moss/foliage audio textures."
    },
    {
        id: "era-02",
        number: "02",
        title: "Capsule: Neon Nostalgia",
        version: "v2.1.0",
        badge: "DELUXE EDITION RELEASED",
        description: "5 Singles Drop · Retro game UI systems re-examined alongside cognitive science notes."
    }
];

// 2. RUNTIME ENGINE: Render arrays dynamically to matching grids
function initApplication() {
    renderGardenGrid();
    renderCatalog();
    setupEventHandlers();
    lucide.createIcons(); // Instantiates structural vector icons
}

function renderGardenGrid() {
    const grid = document.getElementById('garden-grid');
    grid.innerHTML = gardenData.map(card => `
        <article class="sublime-card p-5 rounded-xl shadow-sm flex flex-col justify-between space-y-4 cursor-pointer" onclick="openStemModal('${card.id}')">
            <div class="space-y-2">
                <div class="flex justify-between items-start">
                    <span class="text-[10px] border px-2 py-0.5 rounded font-medium font-mono-tag ${card.typeClass}">${card.type}</span>
                    <span class="text-[10px] text-neutral-400 font-light font-mono-tag">${card.platform}</span>
                </div>
                <div class="text-sm font-serif italic text-neutral-800 leading-relaxed pt-2">
                    ${card.content.length > 140 ? card.content.substring(0, 140) + '...' : card.content}
                </div>
            </div>
            <div class="border-t border-neutral-100 pt-3 flex justify-between items-center text-xs text-neutral-400 font-mono-tag">
                <span>Source: <span class="underline">${card.source}</span></span>
                <span class="text-neutral-500 font-medium">${card.meta}</span>
            </div>
        </article>
    `).join('');
}

function renderCatalog() {
    const list = document.getElementById('catalog-list');
    list.innerHTML = catalogData.map(era => `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-neutral-50/50 border border-[#eae7e4] rounded-lg hover:bg-neutral-50 transition-colors gap-3">
            <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-neutral-300 font-mono-tag">${era.number}</span>
                <div>
                    <h3 class="text-sm font-bold text-neutral-900">
                        ${era.title} 
                        ${era.badge ? `<span class="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded-full ml-2">${era.badge}</span>` : `<span class="text-[11px] text-neutral-400 font-normal font-mono ml-2">${era.version}</span>`}
                    </h3>
                    <p class="text-xs text-neutral-500 font-light mt-0.5">${era.description}</p>
                </div>
            </div>
            <div class="flex gap-2 w-full sm:w-auto font-mono-tag">
                <button class="text-xs bg-white text-neutral-700 font-medium border border-neutral-200 shadow-sm px-3 py-1.5 rounded hover:bg-neutral-50 flex-1 sm:flex-none">▶ Play Stream</button>
                <button class="text-xs bg-white text-neutral-700 font-medium border border-neutral-200 shadow-sm px-3 py-1.5 rounded hover:bg-neutral-50 flex-1 sm:flex-none">⌥ Download Stems</button>
            </div>
        </div>
    `).join('');
}

// 3. INTERACTIVE ENGINE: Control Lightbox/Modal Views
function openStemModal(id) {
    const card = gardenData.find(item => item.id === id);
    if (!card) return;

    document.getElementById('modal-title').innerText = card.source;
    document.getElementById('modal-content').innerHTML = card.content;
    document.getElementById('modal-source').innerText = `Origin Workspace: ${card.platform}`;
    
    const tagContainer = document.getElementById('modal-tag-container');
    tagContainer.innerHTML = `<span class="text-[10px] border px-2 py-0.5 rounded font-medium font-mono-tag ${card.typeClass}">${card.type}</span>`;

    document.getElementById('stem-modal').classList.remove('hidden');
}

function setupEventHandlers() {
    const closeModal = () => document.getElementById('stem-modal').classList.add('hidden');
    document.getElementById('close-modal').addEventListener('click', closeModal);
    
    // Close modal if user clicks grayed backdrop container out-of-bounds
    document.getElementById('stem-modal').addEventListener('click', (e) => {
        if (e.target.id === 'stem-modal') closeModal();
    });

    // Quick Action simulation placeholder trigger
    document.getElementById('add-clip-btn').addEventListener('click', () => {
        const textPrompt = prompt("Clip a quick thought, link, or theory token into your Garden:");
        if (textPrompt) {
            gardenData.unshift({
                id: `clip-${Date.now()}`,
                type: "Clipped Insight Note",
                typeClass: "bg-neutral-50 text-neutral-700 border-neutral-200",
                source: "Manual Capture Drop",
                platform: "via Quick Clip",
                content: `"${textPrompt}"`,
                meta: "★ Freshly Planted"
            });
            renderGardenGrid();
        }
    });
}

// Start application process upon structural asset resolution
window.addEventListener('DOMContentLoaded', initApplication);
