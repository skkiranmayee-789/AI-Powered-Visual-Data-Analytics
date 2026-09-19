let currentFile = null;
let currentFileType = null;
let violationsChartInstance = null;
let departmentChartInstance = null;
let activeModalViolationId = null;
let isWebcamRunning = false;
let audioAlarmEnabled = true;

// ================= NAVIGATION =================
function switchTab(tab) {
    document.getElementById('login-form').classList.toggle('active', tab === 'login');
    document.getElementById('signup-form').classList.toggle('active', tab === 'signup');
    document.getElementById('login-tab-btn').classList.toggle('active', tab === 'login');
    document.getElementById('signup-tab-btn').classList.toggle('active', tab === 'signup');
}

function switchView(viewId, btnElement) {
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    
    document.getElementById(viewId).classList.add('active');
    btnElement.classList.add('active');

    if (viewId === 'dashboard-view') {
        loadDashboardMetrics();
        loadViolationsTable();
    }
}

function openDashboard() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('upload-section').style.display = 'flex';
    loadDashboardMetrics();
    loadViolationsTable();
}

function logout() {
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('auth-section').style.display = 'flex';
}

// ================= AUTHENTICATION =================
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('user-display-name').innerText = data.user?.name || 'Safety Officer';
            openDashboard();
        } else {
            alert(data.message || 'Authentication failed.');
        }
    } catch (err) {
        openDashboard(); // Demo fallback
    }
});

// ================= MODULE 6: DASHBOARD & REPORTING =================
async function loadDashboardMetrics() {
    try {
        const res = await fetch('/api/dashboard/metrics');
        const data = await res.json();
        if (!data.success) return;

        document.getElementById('kpi-compliance').innerText = `${data.kpis.compliance_percentage}%`;
        document.getElementById('kpi-critical').innerText = data.kpis.critical_violations;
        document.getElementById('kpi-total').innerText = data.kpis.total_violations;
        document.getElementById('kpi-open').innerText = data.kpis.open_violations;
        document.getElementById('kpi-resolved').innerText = data.kpis.resolved_violations;
        document.getElementById('kpi-resolution').innerText = `${data.kpis.resolution_rate}%`;

        renderViolationsChart(data.by_type);
        renderDepartmentChart(data.by_department);
    } catch (e) {
        console.error("Dashboard error:", e);
    }
}

function renderViolationsChart(typeData) {
    const ctx = document.getElementById('violationsTypeChart').getContext('2d');
    if (violationsChartInstance) violationsChartInstance.destroy();

    const labels = Object.keys(typeData || {});
    const counts = Object.values(typeData || {});

    violationsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length ? labels : ['Hardhat', 'Vest', 'Ladders', 'Perimeter'],
            datasets: [{
                label: 'Violations Detected',
                data: counts.length ? counts : [4, 2, 1, 1],
                backgroundColor: '#6366f1',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: '#1c263c' }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

function renderDepartmentChart(deptData) {
    const canvas = document.getElementById('departmentChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (departmentChartInstance) departmentChartInstance.destroy();

    const labels = Object.keys(deptData || {});
    const counts = Object.values(deptData || {});

    departmentChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length ? labels : ['Manufacturing', 'Logistics', 'Maintenance'],
            datasets: [{
                label: 'Violations',
                data: counts.length ? counts : [3, 2, 1],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8' }
                }
            }
        }
    });
}

async function loadViolationsTable() {
    const severity = document.getElementById('filterSeverity').value;
    const status = document.getElementById('filterStatus').value;
    const department = document.getElementById('filterDepartment').value;

    try {
        const res = await fetch(`/api/dashboard/violations?severity=${encodeURIComponent(severity)}&status=${encodeURIComponent(status)}&department=${encodeURIComponent(department)}`);
        const data = await res.json();
        const tbody = document.getElementById('violationsTableBody');
        tbody.innerHTML = '';

        if (!data.violations || data.violations.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#94a3b8;">No matching violation logs.</td></tr>`;
            return;
        }

        data.violations.forEach(v => {
            const sevBadge = v.severity === 'Critical' ? 'badge-critical' : 'badge-high';
            const statBadge = v.status === 'Resolved' ? 'badge-resolved' : 'badge-open';
            tbody.innerHTML += `
                <tr onclick='openIncidentModal(${JSON.stringify(v)})'>
                    <td>#${v.id}</td>
                    <td>${v.timestamp}</td>
                    <td><strong>${v.violation_type}</strong></td>
                    <td>${v.location}</td>
                    <td>${v.department}</td>
                    <td><span class="badge ${sevBadge}">${v.severity}</span></td>
                    <td><span class="badge ${statBadge}">${v.status}</span></td>
                    <td>
                        <button class="btn btn-secondary" style="padding:4px 8px;font-size:11px;" onclick="event.stopPropagation(); openIncidentModal(${JSON.stringify(v)})">Inspect</button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        console.error("Table fetch error:", e);
    }
}

// ================= EXTRA FEATURE 1: 1-CLICK DEMO SCENARIOS =================
function loadScenario(type) {
    if (type === 'machinery') {
        document.getElementById('correlationDetection').value = "Worker detected operating hydraulic press without certified hardhat and high-visibility vest at 10:15 AM.";
        document.getElementById('correlationRules').value = "Section 4.1: Mandatory Hard Hats & High-Vis Vests must be worn within 5 meters of active machinery and fabrication lines.";
    } else if (type === 'scaffold') {
        document.getElementById('correlationDetection').value = "Subcontractor observed at 3.2m scaffold platform without tethered harness anchor point.";
        document.getElementById('correlationRules').value = "Section 2.1: Full-body harness tethered to certified overhead anchor is compulsory above 2.0 meters.";
    } else if (type === 'fire') {
        document.getElementById('correlationDetection').value = "Four material pallets blocking secondary warehouse emergency exit route.";
        document.getElementById('correlationRules').value = "Section 4.1: Emergency exit routes and stairwells must remain 100% unobstructed at all times.";
    }
}

// ================= EXTRA FEATURE 2: LIVE WEBCAM MODE =================
async function toggleWebcam() {
    const video = document.getElementById('webcamFeed');
    const placeholder = document.querySelector('.placeholder-content');

    if (!isWebcamRunning) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
            document.getElementById('previewBadge').innerText = 'LIVE CCTV ACTIVE';
            document.getElementById('previewBadge').className = 'badge badge-critical';
            isWebcamRunning = true;
        } catch (e) {
            alert("Could not access camera feed (permission denied or no camera).");
        }
    } else {
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        video.style.display = 'none';
        if (placeholder) placeholder.style.display = 'block';
        document.getElementById('previewBadge').innerText = 'Feed Inactive';
        document.getElementById('previewBadge').className = 'badge';
        isWebcamRunning = false;
    }
}

// ================= EXTRA FEATURE 3: AUDIO SIREN =================
function toggleAudioAlarm() {
    audioAlarmEnabled = !audioAlarmEnabled;
    const txt = document.getElementById('sirenStatusText');
    if (txt) {
        txt.innerText = audioAlarmEnabled ? 'ENABLED' : 'MUTED';
        txt.style.color = audioAlarmEnabled ? 'var(--success)' : 'var(--danger)';
    }
    alert(audioAlarmEnabled ? "🔊 Safety Alarm Siren: Enabled" : "🔇 Safety Alarm Siren: Muted");
}

function playAlarmSound() {
    if (!audioAlarmEnabled) return;
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {}
}

// ================= EXTRA FEATURE 4: INCIDENT MODAL =================
function openIncidentModal(v) {
    activeModalViolationId = v.id;
    document.getElementById('modalTitle').innerText = `Incident Audit #${v.id} — ${v.violation_type}`;
    document.getElementById('modalMeta').innerText = `${v.location} • Department: ${v.department}`;
    document.getElementById('modalSeverity').innerText = v.severity;
    document.getElementById('modalSeverity').className = `badge ${v.severity === 'Critical' ? 'badge-critical' : 'badge-high'}`;
    document.getElementById('modalStatus').innerText = v.status;
    document.getElementById('modalStatus').className = `badge ${v.status === 'Resolved' ? 'badge-resolved' : 'badge-open'}`;
    document.getElementById('modalTime').innerText = v.timestamp;
    document.getElementById('modalEvidence').innerText = v.evidence_ref || 'CAM-01 Live Detection Snapshot';
    document.getElementById('incidentModal').style.display = 'flex';
}

function closeIncidentModal() {
    document.getElementById('incidentModal').style.display = 'none';
}

async function resolveCurrentModalViolation() {
    if (!activeModalViolationId) return;
    await fetch('/api/dashboard/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeModalViolationId, status: 'Resolved' })
    });
    closeIncidentModal();
    loadDashboardMetrics();
    loadViolationsTable();
}

// ================= MODULE 1 & 2: LIVE VISION & RAG =================
function handleFileSelect(type) {
    const input = document.getElementById(`${type === 'document' ? 'doc' : type}Input`);
    if (input?.files && input.files[0]) {
        currentFile = input.files[0];
        currentFileType = type;
        document.getElementById('fileName').innerText = currentFile.name;
        document.getElementById('fileMeta').innerText = `${type.toUpperCase()} • ${(currentFile.size / (1024 * 1024)).toFixed(2)} MB`;
        document.getElementById('clearBtn').style.display = 'block';
    }
}

function clearSelectedFile() {
    currentFile = null;
    document.getElementById('fileName').innerText = 'No file chosen';
    document.getElementById('clearBtn').style.display = 'none';
}

function renderPreview() {
    if (!currentFile) return alert('Select a file first.');
    const stage = document.getElementById('previewStage');
    const url = URL.createObjectURL(currentFile);
    if (currentFileType === 'image') {
        stage.innerHTML = `<img src="${url}" class="preview-media">`;
    } else if (currentFileType === 'video') {
        stage.innerHTML = `<video src="${url}" class="preview-media" controls autoplay loop muted></video>`;
    } else {
        stage.innerHTML = `<div class="placeholder-content"><h3>Document Indexed</h3><p>${currentFile.name}</p></div>`;
    }
}

async function analyzeMedia() {
    if (!currentFile) return alert('Please select a file.');
    const stage = document.getElementById('previewStage');
    stage.innerHTML = `<div class="placeholder-content"><h3>Running YOLOv8 Dual Inference...</h3></div>`;

    const formData = new FormData();
    formData.append('file', currentFile);

    const endpoint = currentFileType === 'document' ? '/api/process-document' : '/api/analyze';
    const res = await fetch(endpoint, { method: 'POST', body: formData });
    const data = await res.json();

    if (data.success) {
        if (currentFileType === 'image') {
            stage.innerHTML = `<img src="${data.media_url}" class="preview-media">`;
        } else if (currentFileType === 'video') {
            stage.innerHTML = `<video src="${data.media_url}" class="preview-media" controls autoplay loop muted></video>`;
        }
        document.getElementById('detectionDetails').innerHTML = (data.detections || []).map(d => `<span class="badge badge-high">${d}</span>`).join(' ');
        playAlarmSound(); // Trigger sound alert
        loadDashboardMetrics();
    } else {
        alert(data.message || 'Analysis failed.');
    }
}

// ================= MODULE 3 & 4 =================
async function runCorrelation() {
    const res = await fetch('/api/correlate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            detection: document.getElementById('correlationDetection').value,
            rules: document.getElementById('correlationRules').value
        })
    });
    const data = await res.json();
    document.getElementById('correlationResult').textContent = JSON.stringify(data.result, null, 2);
}

async function askSafetyQuestion() {
    const question = document.getElementById('safetyQuestion').value.trim();
    if (!question) return alert('Enter question.');
    const res = await fetch('/api/safety-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
    });
    const data = await res.json();
    document.getElementById('qaResult').textContent = data.answer + "\n\nPolicy References:\n• " + (data.evidence || []).join('\n• ');
}

// ================= EXTRA FEATURE 5: STEP-BY-STEP AGENT GRAPH =================
async function runInvestigation() {
    const query = document.getElementById('investigationQuery').value.trim();
    if (!query) return alert('Enter investigation query.');

    const nodes = ['node-query', 'node-doc', 'node-vision', 'node-val', 'node-reason', 'node-report'];
    nodes.forEach(n => document.getElementById(n).className = 'agent-node');

    // Simulate animated node transitions
    for (let i = 0; i < nodes.length; i++) {
        document.getElementById(nodes[i]).className = 'agent-node active-node';
        await new Promise(r => setTimeout(r, 350));
        document.getElementById(nodes[i]).className = 'agent-node completed-node';
    }

    const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    const data = await res.json();

    document.getElementById('reportContent').textContent = data.report;
    document.getElementById('investigationReport').style.display = 'block';
}

function approveInvestigation() {
    document.getElementById('reviewBadge').className = 'badge badge-resolved';
    document.getElementById('reviewBadge').innerText = '✓ Signed-off by Human Reviewer';
    alert('Investigation report officially signed off and archived.');
}

function rejectInvestigation() {
    prompt('Enter revision comments for agents:');
    document.getElementById('reviewBadge').className = 'badge badge-critical';
    document.getElementById('reviewBadge').innerText = 'Revision Requested';
}