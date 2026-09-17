const terminalLines = [
  { type: "command", text: "ander@uplandes:~$ whoami" },
  { type: "output", text: "Anderson Chang Campos" },
  { type: "command", text: "ander@uplandes:~$ cat carrera.txt" },
  { type: "output", text: "Ingeniería de Sistemas y Computación" },
  { type: "command", text: "ander@uplandes:~$ cat curso.txt" },
  { type: "output", text: "Base de Datos" },
  { type: "command", text: "ander@uplandes:~$ ./iniciar_portafolio.sh" },
  { type: "ok", text: "[OK] Cargando unidades académicas..." },
  { type: "ok", text: "[OK] Cargando prácticas..." },
  { type: "ok", text: "[OK] Cargando proyectos..." },
  { type: "ok", text: "[OK] Sistema iniciado correctamente." }
];

const terminal = document.getElementById("typingTerminal");

function buildTerminalText(text, type) {
  if (type === "command") {
    const firstSpace = text.indexOf(" ");
    const prompt = text.slice(0, firstSpace);
    const command = text.slice(firstSpace + 1);

    const userEnd = prompt.indexOf(":");
    const user = prompt.slice(0, userEnd);
    const path = prompt.slice(userEnd);

    return `<span class="cmd-user">${user}</span><span class="cmd-path">${path}</span> ${command}`;
  }
  return text;
}

async function typeText(element, text, speed = 18) {
  for (let i = 0; i <= text.length; i++) {
    element.textContent = text.slice(0, i);
    await new Promise(resolve => setTimeout(resolve, speed));
  }
}

async function runTerminalIntro() {
  if (!terminal) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    terminal.innerHTML = terminalLines
      .map(line => `<div class="terminal-line ${line.type}">${buildTerminalText(line.text, line.type)}</div>`)
      .join("");
    return;
  }

  for (const line of terminalLines) {
    const row = document.createElement("div");
    row.className = `terminal-line ${line.type}`;
    terminal.appendChild(row);

    if (line.type === "command") {
      row.innerHTML = buildTerminalText("", line.type);
      await typeText(row, line.text, 12);
    } else {
      await typeText(row, line.text, 9);
    }

    await new Promise(resolve => setTimeout(resolve, line.type === "command" ? 160 : 95));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  runTerminalIntro();

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => revealObserver.observe(item));

  const progressFill = document.querySelector(".progress-fill");
  const skillFills = document.querySelectorAll(".skill-track i");

  const progressObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      if (progressFill) {
        progressFill.style.width = `${progressFill.dataset.progress}%`;
      }

      skillFills.forEach(fill => {
        fill.style.width = `${fill.dataset.level}%`;
      });

      progressObserver.disconnect();
    });
  }, { threshold: 0.2 });

  const statusSection = document.getElementById("status");
  if (statusSection) progressObserver.observe(statusSection);

  document.querySelectorAll(".folder-card").forEach(button => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.animate(
          [
            { boxShadow: "0 0 0 1px rgba(0,255,127,.08), 0 0 0 rgba(0,255,127,0)" },
            { boxShadow: "0 0 0 1px rgba(0,255,127,.3), 0 0 42px rgba(0,255,127,.12)" },
            { boxShadow: "0 0 0 1px rgba(0,255,127,.08), 0 0 0 rgba(0,255,127,0)" }
          ],
          { duration: 900, easing: "ease" }
        );
      }
    });
  });

  const scrollProject = document.querySelector(".scroll-project");
  const projectSection = document.getElementById("projects");
  if (scrollProject && projectSection) {
    scrollProject.addEventListener("click", () => {
      projectSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  document.querySelectorAll("[data-demo]").forEach(button => {
    button.addEventListener("click", () => {
      showToast(button.dataset.demo);
    });
  });

  const modal = document.getElementById("imageModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");

  document.querySelectorAll(".evidence-item").forEach(item => {
    item.addEventListener("click", () => {
      const filename = item.querySelector("strong")?.textContent || "evidencia.png";
      if (modalTitle) modalTitle.textContent = filename;
      if (modalText) {
        modalText.textContent = `Vista de ${filename}. Para usar una imagen real, coloca el archivo dentro de img/evidencias/ y reemplaza este marcador en index.html.`;
      }
      if (modal) {
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      }
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach(el => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  const consoleForm = document.getElementById("consoleForm");
  const consoleInput = document.getElementById("consoleInput");
  const consoleOutput = document.getElementById("consoleOutput");

  const commands = {
    help: [
      "Comandos disponibles:",
      "help     → muestra esta ayuda",
      "about    → información del estudiante",
      "units    → lista las 4 unidades",
      "skills   → muestra habilidades principales",
      "projects → muestra el proyecto final",
      "clear    → limpia la consola"
    ],
    about: [
      "Nombre: Anderson Chang Campos",
      "Carrera: Ingeniería de Sistemas y Computación",
      "Universidad: Universidad Peruana Los Andes",
      "Curso: Base de Datos"
    ],
    units: [
      "unidad_01/  Fundamentos de Base de Datos",
      "unidad_02/  Diseño y Modelado de Bases de Datos",
      "unidad_03/  Lenguaje SQL y Gestión de Datos",
      "unidad_04/  Implementación y Administración"
    ],
    skills: [
      "SQL ................. 95%",
      "MySQL ............... 90%",
      "Modelado ER ......... 85%",
      "Normalización ....... 82%",
      "Administración BD ... 65%"
    ],
    projects: [
      "./proyecto_final.sh",
      "Sistema de Base de Datos Universitario",
      "status: READY"
    ]
  };

  if (consoleForm && consoleInput && consoleOutput) {
    consoleForm.addEventListener("submit", event => {
      event.preventDefault();
      const raw = consoleInput.value.trim();
      const command = raw.toLowerCase();

      if (!raw) return;

      const cmdLine = document.createElement("div");
      cmdLine.className = "console-command";
      cmdLine.textContent = `ander@uplandes:~$ ${raw}`;
      consoleOutput.appendChild(cmdLine);

      if (command === "clear") {
        consoleOutput.innerHTML = "";
      } else if (commands[command]) {
        commands[command].forEach(line => {
          const response = document.createElement("div");
          response.textContent = line;
          consoleOutput.appendChild(response);
        });
      } else {
        const error = document.createElement("div");
        error.innerHTML = `<span style="color:#ff6b6b">command not found:</span> ${escapeHtml(raw)} · usa <b>help</b>`;
        consoleOutput.appendChild(error);
      }

      consoleInput.value = "";
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
    });
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 600);
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const dbAssistant = document.getElementById("dbAssistant");
  const assistantPanel = document.getElementById("assistantPanel");
  const assistantToggle = document.getElementById("assistantToggle");
  const assistantClose = document.getElementById("assistantClose");

  function setAssistant(open) {
    if (!dbAssistant || !assistantPanel || !assistantToggle) return;
    dbAssistant.classList.toggle("open", open);
    assistantPanel.setAttribute("aria-hidden", String(!open));
    assistantToggle.setAttribute("aria-expanded", String(open));
    assistantToggle.setAttribute("aria-label", open ? "Cerrar asistente" : "Abrir asistente");
  }

  if (dbAssistant && assistantToggle && assistantClose) {
    assistantToggle.addEventListener("click", () => {
      setAssistant(!dbAssistant.classList.contains("open"));
    });

    assistantClose.addEventListener("click", () => setAssistant(false));

    dbAssistant.querySelectorAll("[data-assistant-target]").forEach(button => {
      button.addEventListener("click", () => {
        const target = document.querySelector(button.dataset.assistantTarget);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        setAssistant(false);
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") setAssistant(false);
    });
  }

  const navLinks = [...document.querySelectorAll(".main-nav a")];
  const sectionMap = navLinks
    .map(link => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter(item => item.section);

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.remove("active"));
      const found = sectionMap.find(item => item.section === entry.target);
      if (found) found.link.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

  sectionMap.forEach(item => navObserver.observe(item.section));
});
