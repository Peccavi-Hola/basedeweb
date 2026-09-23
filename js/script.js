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

  // Navigation Menu Toggle
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

  // Scroll Reveals
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

  // Progress Bar Animations
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

  // Folder Quick Navigation
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

  // Toast notifications
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

  // Helper to parse comma separated or JSON array data attributes
  function parseMediaList(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    const str = String(raw).trim();
    if (str.startsWith("[") && str.endsWith("]")) {
      try {
        return JSON.parse(str);
      } catch (e) {
        // Fallback to split
      }
    }
    return str.split(",").map(s => s.trim()).filter(Boolean);
  }

  // =========================================================
  // IMAGE GALLERY MODAL & FULLSCREEN EXPAND
  // =========================================================
  const imageModal = document.getElementById("imageModal");
  const galleryCard = document.querySelector(".modal-gallery-card");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const modalImg = document.getElementById("modalImg");
  const modalCounter = document.getElementById("modalCounter");
  const modalFilename = document.getElementById("modalFilename");
  const modalVisual = document.getElementById("modalVisual");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");
  const galleryThumbs = document.getElementById("galleryThumbs");
  const modalExpandBtn = document.getElementById("modalExpandBtn");
  const expandBtnText = document.getElementById("expandBtnText");

  let currentImages = [];
  let currentImageIndex = 0;
  let isExpanded = false;

  function setExpandedMode(expand) {
    isExpanded = expand;
    if (galleryCard) {
      galleryCard.classList.toggle("expanded", isExpanded);
    }
    if (modalExpandBtn) {
      modalExpandBtn.innerHTML = isExpanded
        ? '<i class="fa-solid fa-compress"></i> <span>Reducir</span>'
        : '<i class="fa-solid fa-expand"></i> <span>Expandir</span>';
    }
  }

  if (modalExpandBtn) {
    modalExpandBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setExpandedMode(!isExpanded);
    });
  }

  if (modalImg) {
    modalImg.addEventListener("click", (e) => {
      e.stopPropagation();
      setExpandedMode(!isExpanded);
    });

    modalImg.onerror = () => {
      if (modalVisual) {
        modalVisual.classList.remove("has-image");
        modalVisual.innerHTML = `
          <div class="modal-placeholder-notice">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <strong>Archivo no encontrado</strong>
            <p>Guarda tu imagen en:</p>
            <code>${currentImages[currentImageIndex] || "img/evidencias/"}</code>
          </div>
        `;
      }
    };
  }

  function updateGalleryUI() {
    if (!currentImages || currentImages.length === 0) {
      if (modalVisual) {
        modalVisual.classList.remove("has-image");
        modalVisual.innerHTML = `
          <div class="modal-placeholder-notice">
            <i class="fa-regular fa-image"></i>
            <strong>Sin imágenes configuradas</strong>
            <p>Agrega los nombres de archivo en el atributo <code>data-images</code>.</p>
          </div>
        `;
      }
      if (modalCounter) modalCounter.textContent = "0 / 0";
      if (modalFilename) modalFilename.textContent = "sin_archivo";
      if (galleryPrev) galleryPrev.style.display = "none";
      if (galleryNext) galleryNext.style.display = "none";
      if (galleryThumbs) galleryThumbs.innerHTML = "";
      return;
    }

    const currentSrc = currentImages[currentImageIndex];
    const filename = currentSrc.split("/").pop();

    // Ensure image and controls are inside modalVisual
    if (modalVisual) {
      modalVisual.innerHTML = `
        <button class="gallery-nav prev" id="galleryPrev" aria-label="Imagen anterior">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <img id="modalImg" src="${currentSrc}" alt="${filename}" title="Clic para expandir / reducir">
        <i id="modalIcon" class="fa-regular fa-image"></i>
        <button class="gallery-nav next" id="galleryNext" aria-label="Imagen siguiente">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      `;
      modalVisual.classList.add("has-image");

      const newImg = modalVisual.querySelector("img");
      const newPrev = modalVisual.querySelector(".gallery-nav.prev");
      const newNext = modalVisual.querySelector(".gallery-nav.next");

      if (newImg) {
        newImg.addEventListener("click", (e) => {
          e.stopPropagation();
          setExpandedMode(!isExpanded);
        });
        newImg.onerror = () => {
          modalVisual.classList.remove("has-image");
          modalVisual.innerHTML = `
            <button class="gallery-nav prev" id="galleryPrev" aria-label="Imagen anterior">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <div class="modal-placeholder-notice">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <strong>Imagen aún no disponible</strong>
              <p>Coloca tu archivo en la carpeta:</p>
              <code>${currentSrc}</code>
            </div>
            <button class="gallery-nav next" id="galleryNext" aria-label="Imagen siguiente">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          `;
          rebindGalleryNav();
        };
      }

      function rebindGalleryNav() {
        const p = modalVisual.querySelector(".gallery-nav.prev");
        const n = modalVisual.querySelector(".gallery-nav.next");
        const hasMult = currentImages.length > 1;
        if (p) {
          p.style.display = hasMult ? "flex" : "none";
          p.onclick = (e) => { e.stopPropagation(); prevGalleryImage(); };
        }
        if (n) {
          n.style.display = hasMult ? "flex" : "none";
          n.onclick = (e) => { e.stopPropagation(); nextGalleryImage(); };
        }
      }

      rebindGalleryNav();
    }

    if (modalCounter) {
      modalCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
    }
    if (modalFilename) {
      modalFilename.textContent = filename;
    }

    const hasMultiple = currentImages.length > 1;

    if (galleryThumbs) {
      if (!hasMultiple) {
        galleryThumbs.innerHTML = "";
        galleryThumbs.style.display = "none";
      } else {
        galleryThumbs.style.display = "flex";
        galleryThumbs.innerHTML = currentImages.map((src, index) => {
          const thumbName = src.split("/").pop();
          const active = index === currentImageIndex ? "active" : "";
          return `
            <button type="button" class="gallery-thumb-item ${active}" data-thumb-index="${index}" title="${thumbName}">
              <img src="${src}" alt="${thumbName}" onerror="this.style.opacity='0.3'">
              <span>${index + 1}</span>
            </button>
          `;
        }).join("");

        galleryThumbs.querySelectorAll(".gallery-thumb-item").forEach(thumb => {
          thumb.addEventListener("click", (e) => {
            e.stopPropagation();
            const idx = parseInt(thumb.dataset.thumbIndex, 10);
            if (!isNaN(idx)) {
              currentImageIndex = idx;
              updateGalleryUI();
            }
          });
        });
      }
    }
  }

  function openImageGallery({ images, title, desc, startIndex = 0 }) {
    currentImages = images || [];
    currentImageIndex = startIndex >= 0 && startIndex < currentImages.length ? startIndex : 0;
    setExpandedMode(false);

    if (modalTitle) modalTitle.textContent = title || "Vista de evidencia";
    if (modalText) {
      modalText.textContent = desc || (currentImages.length ? `${currentImages.length} archivo(s) fotográfico(s).` : "");
    }

    updateGalleryUI();

    if (imageModal) {
      imageModal.classList.add("open");
      imageModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function nextGalleryImage() {
    if (currentImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateGalleryUI();
  }

  function prevGalleryImage() {
    if (currentImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateGalleryUI();
  }

  // Hook all image buttons / cards
  document.querySelectorAll(".evidence-item, .open-evidence-btn, [data-images], [data-img]").forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      let list = [];
      if (item.dataset.images) {
        list = parseMediaList(item.dataset.images);
      } else if (item.dataset.img) {
        list = [item.dataset.img];
      }

      const title = item.dataset.title || item.querySelector("strong")?.textContent || "Vista de evidencia";
      const desc = item.dataset.desc || (list.length > 0
        ? `Mostrando ${list.length} imagen(es) de ${title}.`
        : `Vista de ${title}. Agrega tus imágenes en img/evidencias/.`);

      openImageGallery({ images: list, title, desc });
    });
  });

  // =========================================================
  // PDF VIEWER MODAL
  // =========================================================
  const pdfModal = document.getElementById("pdfModal");
  const pdfModalTitle = document.getElementById("pdfModalTitle");
  const pdfModalText = document.getElementById("pdfModalText");
  const pdfModalFilename = document.getElementById("pdfModalFilename");
  const modalPdfFrame = document.getElementById("modalPdfFrame");
  const pdfOpenNewTab = document.getElementById("pdfOpenNewTab");
  const pdfDownloadBtn = document.getElementById("pdfDownloadBtn");
  const pdfFallbackLink = document.getElementById("pdfFallbackLink");
  const pdfNavTabs = document.getElementById("pdfNavTabs");

  let currentPdfs = [];
  let currentPdfIndex = 0;

  function updatePdfUI() {
    if (!currentPdfs || currentPdfs.length === 0) {
      if (modalPdfFrame) modalPdfFrame.src = "";
      if (pdfModalFilename) pdfModalFilename.textContent = "";
      if (pdfNavTabs) pdfNavTabs.style.display = "none";
      return;
    }

    const currentSrc = currentPdfs[currentPdfIndex];
    const filename = currentSrc.split("/").pop();

    if (modalPdfFrame) modalPdfFrame.src = currentSrc;
    if (pdfModalFilename) pdfModalFilename.textContent = filename;
    if (pdfOpenNewTab) pdfOpenNewTab.href = currentSrc;
    if (pdfDownloadBtn) {
      pdfDownloadBtn.href = currentSrc;
      pdfDownloadBtn.setAttribute("download", filename);
    }
    if (pdfFallbackLink) pdfFallbackLink.href = currentSrc;

    const hasMultiple = currentPdfs.length > 1;
    if (pdfNavTabs) {
      if (!hasMultiple) {
        pdfNavTabs.style.display = "none";
        pdfNavTabs.innerHTML = "";
      } else {
        pdfNavTabs.style.display = "flex";
        pdfNavTabs.innerHTML = currentPdfs.map((src, index) => {
          const name = src.split("/").pop();
          const active = index === currentPdfIndex ? "active" : "";
          return `
            <button type="button" class="pdf-tab-btn ${active}" data-pdf-index="${index}">
              <i class="fa-solid fa-file-pdf"></i> ${name}
            </button>
          `;
        }).join("");

        pdfNavTabs.querySelectorAll(".pdf-tab-btn").forEach(tab => {
          tab.addEventListener("click", (e) => {
            e.stopPropagation();
            const idx = parseInt(tab.dataset.pdfIndex, 10);
            if (!isNaN(idx)) {
              currentPdfIndex = idx;
              updatePdfUI();
            }
          });
        });
      }
    }
  }

  function openPdfModal({ pdfs, title, desc, startIndex = 0 }) {
    currentPdfs = pdfs || [];
    currentPdfIndex = startIndex >= 0 && startIndex < currentPdfs.length ? startIndex : 0;

    if (pdfModalTitle) pdfModalTitle.textContent = title || "Visor de Documentos PDF";
    if (pdfModalText) {
      pdfModalText.textContent = desc || (currentPdfs.length ? `${currentPdfs.length} documento(s) disponible(s).` : "");
    }

    updatePdfUI();

    if (pdfModal) {
      pdfModal.classList.add("open");
      pdfModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  // Hook all PDF buttons
  document.querySelectorAll(".open-pdf-btn, [data-pdfs], [data-pdf]").forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      let list = [];
      if (item.dataset.pdfs) {
        list = parseMediaList(item.dataset.pdfs);
      } else if (item.dataset.pdf) {
        list = [item.dataset.pdf];
      }

      const title = item.dataset.title || item.querySelector("strong")?.textContent || "Documento PDF";
      const desc = item.dataset.desc || (list.length > 0
        ? `Visualizando documento ${title}.`
        : "Documento en formato PDF.");

      openPdfModal({ pdfs: list, title, desc });
    });
  });

  // Modal Closing & Escape Handling
  function closeAllModals() {
    setExpandedMode(false);

    if (imageModal) {
      imageModal.classList.remove("open");
      imageModal.setAttribute("aria-hidden", "true");
      if (modalVisual) modalVisual.classList.remove("has-image");
    }

    if (pdfModal) {
      pdfModal.classList.remove("open");
      pdfModal.setAttribute("aria-hidden", "true");
      if (modalPdfFrame) modalPdfFrame.src = "";
    }

    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-close-modal]").forEach(el => {
    el.addEventListener("click", closeAllModals);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (isExpanded) {
        setExpandedMode(false);
      } else {
        closeAllModals();
      }
    } else if (imageModal && imageModal.classList.contains("open")) {
      if (event.key === "ArrowRight") {
        nextGalleryImage();
      } else if (event.key === "ArrowLeft") {
        prevGalleryImage();
      }
    }
  });

  // =========================================================
  // INTERACTIVE CONSOLE
  // =========================================================
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

  // Back to Top Button
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 600);
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // DB Assistant
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

  // Active Navigation link on scroll
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
