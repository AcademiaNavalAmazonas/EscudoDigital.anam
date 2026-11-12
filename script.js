// ==========================================================
// 1. CONTROL DE PESTAÑAS (MÓDULOS)
// ==========================================================
function switchTab(event, tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// ==========================================================
// 2. EVALUADOR DE FUERZA DE CONTRASEÑAS
// ==========================================================
function evaluatePassword() {
    const pwd = document.getElementById('pwdInput').value;
    const resultBox = document.getElementById('pwdResult');

    if (!resultBox) return;

    if (pwd.length === 0) {
        resultBox.textContent = "Introduce una contraseña para iniciar el análisis...";
        resultBox.style.color = "#fff";
        resultBox.style.borderColor = "var(--accent-cyan)";
        return;
    }

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score < 2) {
        resultBox.innerHTML = "⚠️ <strong>MUY DÉBIL:</strong> Vulnerable en cuestión de segundos por ataques automatizados.";
        resultBox.style.color = "var(--accent-red, #ff3366)";
    } else if (score < 4) {
        resultBox.innerHTML = "⚡ <strong>MODERADA:</strong> Recomendable añadir caracteres especiales y mayor longitud.";
        resultBox.style.color = "#f59e0b";
    } else {
        resultBox.innerHTML = "🛡️ <strong>ROBUSTA:</strong> Excelente nivel de seguridad ante fuerzas brutas.";
        resultBox.style.color = "#10b981";
    }
}

// ==========================================================
// 3. MOSTRAR / OCULTAR CONTRASEÑA EN EL ANALIZADOR
// ==========================================================
function togglePasswordVisibility() {
    const pwdInput = document.getElementById('pwdInput');
    const eyeIcon = document.getElementById('eyeIcon');

    if (!pwdInput || !eyeIcon) return;

    if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        pwdInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// ==========================================================
// 4. SIMULADOR DE PHISHING DINÁMICO (CASOS VARIABLES)
// ==========================================================
const phishingCases = [
    {
        id: 1,
        text: '📩 <strong>Alerta del Sistema UAN:</strong> "Estimado estudiante, su cuenta institucional será desactivada en 2 horas por falta de actualización. Ingrese sus credenciales inmediatamente en el enlace: <span style="text-decoration: underline;">http://portal-academico-seguro-login.xyz/verificar</span>"',
        isPhish: true,
        explanation: "¡Correcto! Es fraude. Las instituciones usan sus dominios oficiales y nunca amenazan con desactivar cuentas exigiendo claves por enlaces extraños (.xyz)."
    },
    {
        id: 2,
        text: '🔔 <strong>Notificación Bancaria Oficial:</strong> "Estimado cliente, le informamos que su estado de cuenta mensual ya se encuentra disponible para visualización en nuestra aplicación móvil oficial o ingresando mediante su usuario a <span style="text-decoration: underline;">https://www.bancoseguro.fin.ec</span>"',
        isPhish: false,
        explanation: "¡Correcto! Es un mensaje legítimo. No exige datos personales por urgencia, utiliza un dominio oficial del país (.fin.ec) y te invita a usar la app oficial."
    },
    {
        id: 3,
        text: '🎁 <strong>Sorteo Exclusivo:</strong> "¡Felicidades! Has sido seleccionado aleatoriamente para ganar el nuevo iPhone 16 Pro. Para reclamar tu premio, solo debes pagar $3.50 de costo de envío ingresando los datos de tu tarjeta en: <span style="text-decoration: underline;">http://premios-flash-envios.online/reclamar</span>"',
        isPhish: true,
        explanation: "¡Correcto! Es fraude clásico (Gancho de Premio). Nadie regala teléfonos caros pidiendo cobros pequeños de envío en páginas no oficiales."
    },
    {
        id: 4,
        text: '📦 <strong>Servicio de Envíos:</strong> "Hola Juan, tu paquete con guía #48291 está en camino a la dirección registrada. Puedes rastrear el estado de entrega en tiempo real desde nuestro sitio web oficial usando tu número de guía."',
        isPhish: false,
        explanation: "¡Correcto! Es legítimo. Es una notificación informativa genérica que no pide contraseñas, claves ni pagos urgentes mediante enlaces sospechosos."
    },
    {
        id: 5,
        text: '🎬 <strong>Suscripción de Streaming:</strong> "Hubo un problema con el cobro de tu membresía mensual. Tu cuenta será suspendida hoy mismo. Actualiza tus datos de pago en: <span style="text-decoration: underline;">http://netflix-actualizacion-pagos.com/login</span>"',
        isPhish: true,
        explanation: "¡Correcto! Es phishing. Las plataformas formales notifican fallos dentro de su propia app oficial y no amenazan con cortes inmediatos por enlaces de dominios sospechosos."
    },
    {
        id: 6,
        text: '💡 <strong>Factura de Energía Eléctrica:</strong> "Estimado usuario, su planilla de servicio eléctrico correspondiente al mes actual ya se encuentra emitida. Puede consultar los detalles y valores descargando su factura digital desde nuestra aplicación o ingresando a <span style="text-decoration: underline;">https://www.empresaelectrica.gob.ec</span>"',
        isPhish: false,
        explanation: "¡Correcto! Es un mensaje legítimo. Utiliza un dominio oficial gubernamental (.gob.ec) y te orienta a usar canales formales sin solicitar claves personales de forma urgente."
    },
    {
        id: 7,
        text: '📦 <strong>Retención de Paquete:</strong> "Su envío internacional se encuentra detenido en el centro de distribución por falta de pago de aranceles aduaneros ($2.99). Regularice su entrega en: <span style="text-decoration: underline;">http://aduanas-envios-express.net/cobro</span>"',
        isPhish: true,
        explanation: "¡Correcto! Es fraude (estafa de paquetería). Las empresas de envío legítimas no cobran valores adicionales menores por enlaces extraños para liberar paquetes."
    },
    {
        id: 8,
        text: '🎓 <strong>Secretaría Académica:</strong> "Aviso importante: El periodo de matriculación ordinaria para el siguiente ciclo lectivo estará habilitado desde el lunes próximo. Consulte los requisitos en el portal estudiantil institucional."',
        isPhish: false,
        explanation: "¡Correcto! Es legítimo. Se trata de un aviso informativo institucional estándar que no solicita credenciales, dinero ni incluye enlaces raros."
    },
    {
        id: 9,
        text: '💰 <strong>Bono Estudiantil del Estado:</strong> "Felicidades ciudadano, ha sido seleccionado para recibir el subsidio educativo de $250. Para validar su identidad y depositar el fondo, ingrese sus datos bancarios en: <span style="text-decoration: underline;">http://bono-estudiantil-gob.info/registro</span>"',
        isPhish: true,
        explanation: "¡Correcto! Es fraude de suplantación. Ningún organismo estatal solicita números ni contraseñas de tarjetas de crédito mediante enlaces de dominios no oficiales (.info)."
    },
    {
        id: 10,
        text: '🔒 <strong>Alerta de Seguridad:</strong> "Hemos detectado un inicio de sesión en su cuenta de correo desde un dispositivo desconocido en otra ciudad. Si no fue usted, le recomendamos cambiar su contraseña ingresando a la configuración de seguridad oficial de su cuenta."',
        isPhish: false,
        explanation: "¡Correcto! Es una notificación legítima de seguridad. Te advierte del riesgo sin enviarte a un sitio sospechoso, instándote a revisar los ajustes en la plataforma oficial."
    },
    {
        id: 11,
        text: '📈 <strong>Inversión Financiera:</strong> "Gane hasta un 300% de rentabilidad en menos de 24 horas operando en criptomonedas con nuestro software automatizado. Regístrese hoy mismo en: <span style="text-decoration: underline;">http://crypto-ganancias-rapidas.biz</span>"',
        isPhish: true,
        explanation: "¡Correcto! Es una estafa clásica (gancho de dinero fácil). Ninguna entidad de inversión seria promete ganancias astronómicas garantizadas en cuestión de horas."
    },
    {
        id: 12,
        text: '📚 <strong>Biblioteca Municipal:</strong> "Le recordamos que tiene un libro en préstamo próximo a vencer. Puede realizar la renovación de la fecha de entrega ingresando con su usuario a la intranet de la biblioteca."',
        isPhish: false,
        explanation: "¡Correcto! Es legítimo. Es un recordatorio de servicio que se gestiona de forma interna en el sistema de la biblioteca sin pedir datos financieros."
    },
    {
        id: 13,
        text: '🏛️ <strong>Servicio de Rentas Internas:</strong> "Notificación fiscal: Usted registra un saldo a favor por devolución de impuestos de $340. Para acreditar el valor a su cuenta, complete el formulario en: <span style="text-decoration: underline;">http://devolucion-sri-gob-ec.com/tramite</span>"',
        isPhish: true,
        explanation: "¡Correcto! Es fraude. Las entidades tributarias realizan devoluciones por canales oficiales autenticados y no usan páginas web de terceros con dominios modificados (.com en lugar de .gob.ec)."
    },
    {
        id: 14,
        text: '🏥 <strong>Centro Médico:</strong> "Estimado paciente, le recordamos que tiene una cita agendada con el especialista para mañana a las 10:00 AM. Por favor presentarse 15 minutos antes en ventanilla."',
        isPhish: false,
        explanation: "¡Correcto! Es legítimo. Cumple una función estrictamente informativa y no solicita pagos ni credenciales personales por internet."
    }
];

let currentCaseIndex = 0;

function loadRandomPhishingCase() {
    const msgContainer = document.getElementById('phishMessageText');
    if (!msgContainer) return;

    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * phishingCases.length);
    } while (newIndex === currentCaseIndex && phishingCases.length > 1);
    
    currentCaseIndex = newIndex;
    const currentCase = phishingCases[currentCaseIndex];

    msgContainer.innerHTML = currentCase.text;
    
    const resultBox = document.getElementById('phishResult');
    if (resultBox) {
        resultBox.innerHTML = "Selecciona una opción para evaluar tu respuesta...";
        resultBox.style.color = "#94a3b8";
        resultBox.style.background = "rgba(15, 23, 42, 0.9)";
        resultBox.style.border = "1px solid rgba(255, 255, 255, 0.1)";
    }
}

function evaluatePhishingChoice(userGuess) {
    const currentCase = phishingCases[currentCaseIndex];
    const resultBox = document.getElementById('phishResult');

    if (!resultBox) return;

    if (userGuess === currentCase.isPhish) {
        resultBox.innerHTML = `✅ <strong>¡Excelente! Acertaste.</strong> ${currentCase.explanation}`;
        resultBox.style.color = "#10b981";
        resultBox.style.background = "rgba(16, 185, 129, 0.1)";
        resultBox.style.border = "1px solid #10b981";
    } else {
        resultBox.innerHTML = `❌ <strong>¡Cuidado, fallaste!</strong> Analiza mejor los indicios de urgencia y los dominios sospechosos.`;
        resultBox.style.color = "var(--accent-red, #ff3366)";
        resultBox.style.background = "rgba(255, 51, 102, 0.1)";
        resultBox.style.border = "1px solid var(--accent-red, #ff3366)";
    }
}

// ==========================================================
// 5. GENERADOR DE CONTRASEÑAS SEGURAS
// ==========================================================
function generateSecurePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";
    let password = "";
    const length = 14;
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const pwdBox = document.getElementById("generatedPwdBox");
    if (pwdBox) {
        pwdBox.textContent = password;
    }
}

// ==========================================================
// 6. FUNCIÓN UNIVERSAL PARA COPIAR AL PORTAPAPELES
// ==========================================================
function copyToClipboard(elementId) {
    const textElement = document.getElementById(elementId);
    if (!textElement) return;

    let textToCopy = "";

    if (textElement.tagName === "INPUT") {
        textToCopy = textElement.value;
    } else {
        textToCopy = textElement.textContent;
    }

    if (!textToCopy || textToCopy.includes("Introduce") || textToCopy.includes("Esperando")) {
        alert("No hay ningún valor válido para copiar.");
        return;
    }

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("¡Copiado al portapapeles con éxito! 🛡️");
    }).catch(err => {
        console.error("Error al copiar: ", err);
    });
}

// ==========================================================
// 7. MINIJUEGO: CLASIFICADOR DE ARCHIVOS SEGUROS VS MALICIOSOS
// ==========================================================
const gameFiles = [
    { name: "reporte_academico.pdf", desc: "Documento oficial en formato PDF firmado por la institución.", type: "seguro", icon: "fa-file-pdf" },
    { name: "actualizador_sistema.exe", desc: "Ejecutable descargado de un foro desconocido de internet.", type: "malicioso", icon: "fa-file-zipper" },
    { name: "foto_recuerdo_feria.png", desc: "Imagen personal compartida en alta resolución.", type: "seguro", icon: "fa-file-image" },
    { name: "factura_pendiente_urgente.scr", desc: "Archivo con extensión doble oculta simulando un documento.", type: "malicioso", icon: "fa-file-code" },
    { name: "respaldo_base_datos.sql", desc: "Script de respaldo estructurado de la base institucional.", type: "seguro", icon: "fa-file-lines" },
    { name: "crack_juego_gratis.bat", desc: "Archivo por lotes para saltar licencias de software comercial.", type: "malicioso", icon: "fa-file-shield" },
    { name: "manual_seguridad_informatica.docx", desc: "Guía redactada por el equipo de docentes.", type: "seguro", icon: "fa-file-word" },
    { name: "premio_sorteo_factura.vbs", desc: "Script visual basic adjunto en un correo extraño.", type: "malicioso", icon: "fa-file-arrow-down" }
];

let gameScore = 0;
let gameLives = 3;
let currentFile = null;
let isGameOver = false;

function initGame() {
    gameScore = 0;
    gameLives = 3;
    isGameOver = false;
    document.getElementById('gameScore').textContent = gameScore;
    document.getElementById('gameLives').textContent = gameLives;
    document.getElementById('gameButtons').style.display = 'flex';
    document.getElementById('restartGameBtn').style.display = 'none';
    loadNextFile();
}

function loadNextFile() {
    if (gameLives <= 0) return;

    const randomIndex = Math.floor(Math.random() * gameFiles.length);
    currentFile = gameFiles[randomIndex];

    document.getElementById('fileName').textContent = currentFile.name;
    document.getElementById('fileDesc').textContent = currentFile.desc;
    document.getElementById('fileIcon').className = `fa-solid ${currentFile.icon}`;
    document.getElementById('gameFeedback').textContent = "Clasifica este archivo antes de que corra peligro el sistema.";
    document.getElementById('gameFeedback').style.color = "var(--text-muted)";
}

function handleFileChoice(playerChoice) {
    if (isGameOver) return;

    const feedbackBox = document.getElementById('gameFeedback');

    if (playerChoice === currentFile.type) {
        gameScore += 10;
        document.getElementById('gameScore').textContent = gameScore;
        feedbackBox.innerHTML = `✅ <strong>¡Correcto!</strong> Identificaste bien el archivo (${currentFile.type.toUpperCase()}).`;
        feedbackBox.style.color = "#10b981";
    } else {
        gameLives--;
        document.getElementById('gameLives').textContent = gameLives;
        feedbackBox.innerHTML = `❌ <strong>¡Error!</strong> Era un archivo ${currentFile.type.toUpperCase()}. Perdiste una vida.`;
        feedbackBox.style.color = "var(--accent-red)";
    }

    if (gameLives <= 0) {
        isGameOver = true;
        document.getElementById('gameButtons').style.display = 'none';
        document.getElementById('restartGameBtn').style.display = 'block';
        feedbackBox.innerHTML = `🚨 <strong>¡JUEGO TERMINADO!</strong> Tu sistema fue infectado. Puntuación final: <strong>${gameScore} puntos</strong>.`;
        feedbackBox.style.color = "var(--accent-red)";
    } else {
        setTimeout(loadNextFile, 1200);
    }
}

// ==========================================================
// INICIALIZACIÓN GLOBAL AL CARGAR LA PÁGINA
// ==========================================================
window.addEventListener('DOMContentLoaded', () => {
    loadRandomPhishingCase();
    initGame();
});