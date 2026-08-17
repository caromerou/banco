const bankingProblems = [
    {
        id: 1,
        title: "Disputa de Transacción No Reconocida (Doble Cargo)",
        category: "Fraudes y Pagos",
        description: "Ocurre cuando un cliente realiza una compra y por una intermitencia de red o timeout, la transacción se procesa pero la respuesta se interrumpe, causando que el usuario o el sistema reintenten la petición y se debiten fondos dos veces.",
        impact: "Riesgo reputacional alto, insatisfacción del cliente, costos operativos por investigación de contracargos y diferencias en arqueos de pasarela.",
        questions: [
            "¿Cómo detecta el sistema de pagos peticiones repetidas en ventanas cortas de tiempo?",
            "¿Cuál es el flujo de conciliación nocturna ante diferencias de compensación?",
            "¿Qué plazos normativos aplican para la retención preventiva de fondos al comercio?"
        ],
        hus: [
            {
                code: "[HU-PAY-01]",
                title: "Prevención de cargos duplicados por reintentos (Idempotencia)",
                desc: "Como sistema de pagos, quiero identificar solicitudes repetidas para evitar un doble débito al cliente.",
                gherkin: "<b>Given</b> que una compra tardó por intermitencia de red<br><b>When</b> el sistema recibe una petición idéntica en menos de 60 segundos<br><b>Then</b> debe aplicar idempotencia y rechazar el segundo cobro sin restar fondos."
            },
            {
                code: "[HU-PAY-02]",
                title: "Conciliación automática de diferencias por compensación",
                desc: "Como analista de operaciones, quiero cruzar los archivos de la franquicia con el core para marcar dobles cargos automáticamente.",
                gherkin: "<b>Given</b> que el archivo de compensación diario muestra discrepancias<br><b>When</b> se ejecuta el motor de conciliación nocturna<br><b>Then</b> el sistema genera un reporte automático de cuentas afectadas para reversión."
            }
        ],
        diagrams: [
            {
                title: "1. Diagrama de Casos de Uso (UML)",
                desc: "Interacción entre el Cliente, el Analista de Operaciones y el Core Bancario.",
                src: "IMAGES/Diagrama_CasosUso(uml).png"
            },
            {
                title: "2. Diagrama de Actividades / Flujo de Negocio",
                desc: "Flujo paso a paso con compuertas lógicas de decisión para la validación de idempotencia.",
                src: "IMAGES/Diagrama_Activiades.png"
            },
            {
                title: "3. Diagrama de Secuencia (UML)",
                desc: "Intercambio técnico de peticiones entre App, API Gateway, Motor de Idempotencia y Core Bancario ante un Timeout.",
                src: "IMAGES/Diagrama_Secuencia.png"
            }
        ],
        rules: [
            "Ventana de tiempo para validación de idempotencia: 60 segundos.",
            "Tolerancia máxima de monto para auto-reversión en conciliación: $10.000.000 COP.",
            "Trazabilidad obligatoria en logs de auditoría por cada intento bloqueado."
        ],
        risks: [
            "<b>Supuesto:</b> La pasarela externa responde con códigos de error estándar (Timeouts 504).",
            "<b>Riesgo:</b> Falsos positivos que bloqueen compras legítimas consecutivas del usuario en el mismo comercio."
        ]
    },
    {
        id: 2,
        title: "Falla en Dispensador de Efectivo en Cajero Automático (ATM)",
        category: "Canales / Red Física",
        description: "Un usuario retira dinero en efectivo en un ATM, la cuenta se debita pero el dispensador se atasca y no entrega los billetes físicos.",
        impact: "Reclamo inmediato en oficinas, afectación de la confianza en cajeros automáticos y diferencias operativas de efectivo en la sucursal.",
        questions: [
            "¿Cómo se vincula el journal de errores del cajero con el estado de la cuenta de ahorros?",
            "¿Cuál es el SLA para la devolución provisional del saldo retenido al cliente?"
        ],
        hus: [
            {
                code: "[HU-ATM-01]",
                title: "Reversión automática por falla mecánica de cajero",
                desc: "Como usuario afectado por un cajero atascado, quiero que se devuelva el dinero a mi cuenta de forma automática.",
                gherkin: "<b>Given</b> que el sensor del cajero confirma atasco sin entrega de efectivo<br><b>When</b> el ATM reporta la transacción como fallida al Core Bancario<br><b>Then</b> se ejecuta la reversión del saldo al cliente en menos de 24 horas."
            }
        ],
        diagrams: [],
        rules: [
            "El cajero debe generar un ticket digital de error con código de dispositivo físico.",
            "La validación de arqueo físico debe coincidir con el reporte de fallas digitales del día."
        ],
        risks: [
            "<b>Supuesto:</b> El cajero cuenta con conectividad permanente de red para reportar el estado del dispensador."
        ]
    }
];

function loadProblemList() {
    const listContainer = document.getElementById('problem-list');
    listContainer.innerHTML = '';

    bankingProblems.forEach((problem, index) => {
        const li = document.createElement('li');
        li.className = `problem-item ${index === 0 ? 'active' : ''}`;
        li.innerText = problem.title;
        li.onclick = () => selectProblem(problem.id, li);
        listContainer.appendChild(li);
    });

    displayProblemData(bankingProblems[0]);
}

function selectProblem(id, element) {
    document.querySelectorAll('.problem-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    const selected = bankingProblems.find(p => p.id === id);
    displayProblemData(selected);
}

function displayProblemData(problem) {
    // Módulo 1: Problema
    document.getElementById('problem-category').innerText = problem.category;
    document.getElementById('problem-title').innerText = problem.title;
    document.getElementById('problem-description').innerText = problem.description;
    document.getElementById('problem-impact').innerText = problem.impact;

    const qContainer = document.getElementById('problem-questions');
    qContainer.innerHTML = '';
    problem.questions.forEach(q => {
        const li = document.createElement('li');
        li.innerText = q;
        qContainer.appendChild(li);
    });

    // Módulo 2: Historias de Usuario (HUs)
    const huContainer = document.getElementById('hu-container');
    huContainer.innerHTML = '';
    problem.hus.forEach(hu => {
        const div = document.createElement('div');
        div.className = 'hu-card';
        div.innerHTML = `
            <div class="hu-title">${hu.code} - ${hu.title}</div>
            <div class="hu-desc">${hu.desc}</div>
            <div class="gherkin-block">${hu.gherkin}</div>
        `;
        huContainer.appendChild(div);
    });

    // Módulo 3: Diagramas
    const diagContainer = document.getElementById('diagrams-container');
    diagContainer.innerHTML = '';
    
    if (problem.diagrams && problem.diagrams.length > 0) {
        problem.diagrams.forEach(diag => {
            const section = document.createElement('section');
            section.className = 'card-section diagram-card';
            section.innerHTML = `
                <h3>${diag.title}</h3>
                <p class="text-box" style="margin-bottom: 12px;">${diag.desc}</p>
                <div class="diagram-img-box">
                    <img src="${diag.src}" alt="${diag.title}" class="diagram-img" onclick="window.open('${diag.src}', '_blank')">
                </div>
            `;
            diagContainer.appendChild(section);
        });
    } else {
        diagContainer.innerHTML = `
            <section class="card-section">
                <p class="text-box">No hay diagramas cargados para este caso aún.</p>
            </section>
        `;
    }

    // Módulo 4: Reglas y Riesgos
    const rulesContainer = document.getElementById('rules-list');
    rulesContainer.innerHTML = '';
    problem.rules.forEach(r => {
        const li = document.createElement('li');
        li.innerText = r;
        rulesContainer.appendChild(li);
    });

    const risksContainer = document.getElementById('risks-list');
    risksContainer.innerHTML = '';
    problem.risks.forEach(rk => {
        const li = document.createElement('li');
        li.innerHTML = rk;
        risksContainer.appendChild(li);
    });
}

function switchModule(moduleName, element) {
    document.querySelectorAll('.module-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    document.querySelectorAll('.content-module').forEach(mod => mod.classList.remove('active'));
    document.getElementById(`module-${moduleName}`).classList.add('active');
}

window.onload = loadProblemList;
