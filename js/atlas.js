export async function loadAnatomyData() {
    try {
        const response = await fetch('data/anatomy.json');
        return await response.json();
    } catch (error) {
        console.error("Could not load anatomy data:", error);
        return [];
    }
}

export function displayAnatomyInfo(data) {
    // Hide placeholder, show content
    document.querySelector('.placeholder-content').classList.add('hidden');
    document.getElementById('anatomy-content').classList.remove('hidden');
    
    // Update fields
    document.getElementById('info-category').textContent = data.category || "Anatomy";
    document.getElementById('info-name-tr').textContent = data.name_latin || data.name;
    document.getElementById('info-name-latin').textContent = data.name_tr || "";
    
    const imgEl = document.getElementById('info-atlas-image');
    document.getElementById('image-error-msg').style.display = 'none';
    imgEl.classList.remove('error');
    if (data.atlas_image) {
        imgEl.src = data.atlas_image;
        imgEl.style.display = 'block';
    } else {
        imgEl.src = "";
        imgEl.style.display = 'none';
        document.getElementById('image-error-msg').style.display = 'block';
    }
    
    document.getElementById('info-description').textContent = data.description || "No description available.";
    document.getElementById('info-location').textContent = data.location || "N/A";
    document.getElementById('info-function').textContent = data.function || "N/A";
    document.getElementById('info-clinical').textContent = data.clinical_information || "N/A";
}

export function renderAtlasGrid(anatomyDB) {
    const grid = document.getElementById('atlas-grid');
    grid.innerHTML = '';
    
    anatomyDB.forEach(item => {
        const card = document.createElement('div');
        card.className = 'atlas-card';
        
        const title = item.name_latin || item.name;
        const sub_title = item.name_tr || '';
        
        card.innerHTML = `
            <div class="card-image-placeholder">
                ${item.atlas_image ? `<img src="${item.atlas_image}" alt="${title}" onerror="this.style.display='none'">` : '<div class="no-image">No Image</div>'}
            </div>
            <div class="card-content">
                <span class="card-category">${item.category || 'Anatomy'}</span>
                <h3>${title}</h3>
                <p class="latin-name">${sub_title}</p>
            </div>
        `;
        
        card.addEventListener('click', () => openAtlasModal(item));
        grid.appendChild(card);
    });
    
    // Setup modal close button
    const closeBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('atlas-modal');
    closeBtn.onclick = () => modal.classList.add('hidden');
    modal.onclick = (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    };
}

function openAtlasModal(data) {
    const modal = document.getElementById('atlas-modal');
    
    // Populate modal fields
    document.getElementById('modal-category').textContent = data.category || "Anatomy";
    document.getElementById('modal-name-tr').textContent = data.name_latin || data.name;
    document.getElementById('modal-name-latin').textContent = data.name_tr || "";
    
    const imgEl = document.getElementById('modal-atlas-image');
    document.getElementById('modal-image-error').style.display = 'none';
    imgEl.classList.remove('error');
    if (data.atlas_image) {
        imgEl.src = data.atlas_image;
        imgEl.style.display = 'block';
    } else {
        imgEl.src = "";
        imgEl.style.display = 'none';
        document.getElementById('modal-image-error').style.display = 'block';
    }
    
    document.getElementById('modal-description').textContent = data.description || "No description available.";
    document.getElementById('modal-location').textContent = data.location || "N/A";
    document.getElementById('modal-function').textContent = data.function || "N/A";
    document.getElementById('modal-clinical').textContent = data.clinical_information || "N/A";
    
    // Show modal
    modal.classList.remove('hidden');
}
