class PromptLibrary {
  constructor() {
    this.promptForm = document.getElementById("promptForm");
    this.promptsList = document.getElementById("promptsList");
    this.titleInput = document.getElementById("promptTitle");
    this.contentInput = document.getElementById("promptContent");
    this.modelInput = document.getElementById("promptModel");
    this.themeToggle = document.getElementById("themeToggle");
    this.userId = this.getUserId();
    this.saveTimeouts = {};
    this.metadata = new PromptMetadata();
    this.VERSION = "1.0.0";

    // Initialize theme
    this.currentTheme = localStorage.getItem("theme") || "light";
    this.applyTheme(this.currentTheme);

    this.init();
  }

  applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      this.themeToggle.querySelector(".theme-toggle-text").textContent =
        "Mode clair";
    } else {
      document.documentElement.removeAttribute("data-theme");
      this.themeToggle.querySelector(".theme-toggle-text").textContent =
        "Mode sombre";
    }
    this.currentTheme = theme;
    localStorage.setItem("theme", theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme(newTheme);
  }

  getUserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = "user-" + Date.now();
      localStorage.setItem("userId", userId);
    }
    return userId;
  }

  init() {
    this.loadPrompts();
    this.promptForm.addEventListener("submit", (e) => this.handleSubmit(e));
    this.promptsList.addEventListener("input", (e) => {
      if (e.target.classList.contains("notes-textarea")) {
        this.handleNotesInput(e);
      }
    });

    // Theme toggling
    this.themeToggle.addEventListener("click", () => this.toggleTheme());

    // Initialisation des fonctionnalités d'import/export
    const exportBtn = document.getElementById("exportBtn");
    const importBtn = document.getElementById("importBtn");
    const importInput = document.getElementById("importInput");

    exportBtn.addEventListener("click", () => this.exportData());
    importBtn.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", (e) => this.handleImport(e));
  }

  handleNotesInput(e) {
    const textarea = e.target;
    const promptId = parseInt(textarea.dataset.promptId);
    const notes = textarea.value;

    // Mise à jour du compteur de caractères
    const statusEl = textarea.nextElementSibling;
    const countEl = statusEl.querySelector(".character-count");
    countEl.textContent = `${notes.length}/500`;

    // Annuler le timeout précédent si existe
    if (this.saveTimeouts[promptId]) {
      clearTimeout(this.saveTimeouts[promptId]);
    }

    // Configurer un nouveau timeout pour la sauvegarde
    this.saveTimeouts[promptId] = setTimeout(() => {
      this.saveNotes(promptId, notes);
    }, 3000);
  }

  saveNotes(promptId, notes) {
    const prompts = this.getPromptsFromStorage();
    const prompt = prompts.find((p) => p.id === promptId);

    if (prompt) {
      prompt.notes = notes;
      prompt.lastEdited = Date.now();
      this.savePromptsToStorage(prompts);

      // Afficher l'indicateur de sauvegarde
      const card = this.promptsList.querySelector(`[data-id="${promptId}"]`);
      const indicator = card.querySelector(".save-indicator");
      indicator.classList.add("visible");

      setTimeout(() => {
        indicator.classList.remove("visible");
      }, 2000);
    }
  }

  loadPrompts() {
    const prompts = this.getPromptsFromStorage();
    this.promptsList.innerHTML = "";

    prompts.forEach((prompt) => this.createPromptCard(prompt));
  }

  getPromptsFromStorage() {
    return JSON.parse(localStorage.getItem("prompts") || "[]");
  }

  savePromptsToStorage(prompts) {
    localStorage.setItem("prompts", JSON.stringify(prompts));
  }

  handleSubmit(e) {
    e.preventDefault();

    const prompt = {
      id: Date.now(),
      title: this.titleInput.value,
      content: this.contentInput.value,
      ratings: [],
      averageRating: 0,
      totalRatings: 0,
      notes: "",
      lastEdited: null,
      metadata: this.metadata.trackModel(
        this.modelInput.value || "default",
        this.contentInput.value
      ),
    };

    const prompts = this.getPromptsFromStorage();
    prompts.push(prompt);
    this.savePromptsToStorage(prompts);

    this.createPromptCard(prompt);
    this.promptForm.reset();
  }

  createMetadataSection(metadata) {
    const container = document.createElement("div");
    container.className = "metadata-container";

    const header = document.createElement("div");
    header.className = "metadata-header";

    const modelName = document.createElement("div");
    modelName.className = "model-name";
    modelName.textContent = metadata.model;

    const timestamps = document.createElement("div");
    timestamps.className = "timestamps";
    timestamps.textContent = `Créé le ${this.metadata.formatDate(
      metadata.createdAt
    )}`;

    const tokenEstimate = document.createElement("div");
    tokenEstimate.className = "token-estimate";

    const tokenRange = document.createElement("span");
    tokenRange.className = "token-range";
    tokenRange.textContent = `${metadata.tokenEstimate.min}-${metadata.tokenEstimate.max} tokens`;

    const confidence = document.createElement("span");
    confidence.className = `confidence-indicator confidence-${metadata.tokenEstimate.confidence}`;
    confidence.textContent = metadata.tokenEstimate.confidence.toUpperCase();

    header.appendChild(modelName);
    header.appendChild(timestamps);
    tokenEstimate.appendChild(tokenRange);
    tokenEstimate.appendChild(confidence);
    container.appendChild(header);
    container.appendChild(tokenEstimate);

    return container;
  }

  createPromptCard(prompt) {
    const card = document.createElement("div");
    card.className = "prompt-card";
    card.dataset.id = prompt.id;

    const preview =
      prompt.content.length > 100
        ? prompt.content.substring(0, 100) + "..."
        : prompt.content;

    const userRating =
      prompt.ratings.find((r) => r.userId === this.userId)?.score || 0;

    card.innerHTML = `
            <h3>${prompt.title}</h3>
            <p>${preview}</p>
            <div class="rating" data-prompt-id="${prompt.id}">
                <input type="radio" id="star5-${prompt.id}" name="rating-${
      prompt.id
    }" value="5" ${userRating === 5 ? "checked" : ""}>
                <label for="star5-${prompt.id}"></label>
                <input type="radio" id="star4-${prompt.id}" name="rating-${
      prompt.id
    }" value="4" ${userRating === 4 ? "checked" : ""}>
                <label for="star4-${prompt.id}"></label>
                <input type="radio" id="star3-${prompt.id}" name="rating-${
      prompt.id
    }" value="3" ${userRating === 3 ? "checked" : ""}>
                <label for="star3-${prompt.id}"></label>
                <input type="radio" id="star2-${prompt.id}" name="rating-${
      prompt.id
    }" value="2" ${userRating === 2 ? "checked" : ""}>
                <label for="star2-${prompt.id}"></label>
                <input type="radio" id="star1-${prompt.id}" name="rating-${
      prompt.id
    }" value="1" ${userRating === 1 ? "checked" : ""}>
                <label for="star1-${prompt.id}"></label>
            </div>
            <div class="rating-stats">
                <span class="average-rating">${prompt.averageRating.toFixed(
                  1
                )}</span>
                <span class="total-ratings">(${
                  prompt.totalRatings
                } votes)</span>
            </div>
            <div class="notes-container">
                <textarea
                    class="notes-textarea"
                    placeholder="Ajouter une note..."
                    maxlength="500"
                    data-prompt-id="${prompt.id}"
                >${prompt.notes || ""}</textarea>
                <div class="notes-status">
                    <span class="save-indicator">Sauvegardé</span>
                    <span class="character-count">${
                      (prompt.notes || "").length
                    }/500</span>
                </div>
            </div>
            <button class="btn-delete" onclick="promptLibrary.deletePrompt(${
              prompt.id
            })">
                Supprimer
            </button>
        `;

    this.promptsList.prepend(card);

    // Ajouter les écouteurs d'événements pour la notation
    const ratingInputs = card.querySelectorAll('input[type="radio"]');
    ratingInputs.forEach((input) => {
      input.addEventListener("change", () =>
        this.handleRating(prompt.id, parseFloat(input.value))
      );
    });
  }

  deletePrompt(id) {
    let prompts = this.getPromptsFromStorage();
    prompts = prompts.filter((prompt) => prompt.id !== id);
    this.savePromptsToStorage(prompts);

    const card = this.promptsList.querySelector(`[data-id="${id}"]`);
    card.remove();
  }

  handleRating(promptId, score) {
    const prompts = this.getPromptsFromStorage();
    const prompt = prompts.find((p) => p.id === promptId);

    if (!prompt) return;

    const existingRating = prompt.ratings.find((r) => r.userId === this.userId);

    if (existingRating) {
      existingRating.score = score;
      existingRating.timestamp = new Date().toISOString();
    } else {
      prompt.ratings.push({
        userId: this.userId,
        score,
        timestamp: new Date().toISOString(),
      });
    }

    // Recalculer la moyenne
    prompt.averageRating = this.calculateAverageRating(prompt.ratings);
    prompt.totalRatings = prompt.ratings.length;

    this.savePromptsToStorage(prompts);
    this.loadPrompts(); // Rafraîchir l'affichage
  }

  calculateAverageRating(ratings) {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr.score, 0);
    return sum / ratings.length;
  }

  async exportData() {
    try {
      const prompts = this.getPromptsFromStorage();
      const stats = this.calculateStats(prompts);

      const exportData = {
        version: this.VERSION,
        timestamp: new Date().toISOString(),
        stats,
        prompts,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `prompt-library-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Erreur lors de l'export : " + error.message);
    }
  }

  calculateStats(prompts) {
    const totalPrompts = prompts.length;
    let totalRatings = 0;
    let sumRatings = 0;
    const modelUsage = {};

    prompts.forEach((prompt) => {
      totalRatings += prompt.ratings.length;
      sumRatings += prompt.averageRating * prompt.ratings.length;
      const model = prompt.metadata.model;
      modelUsage[model] = (modelUsage[model] || 0) + 1;
    });

    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
    const mostUsedModel =
      Object.entries(modelUsage)
        .sort((a, b) => b[1] - a[1])
        .map(([model, count]) => ({ model, count }))[0] || null;

    return {
      totalPrompts,
      totalRatings,
      averageRating,
      mostUsedModel,
    };
  }

  async handleImport(e) {
    try {
      const file = e.target.files[0];
      if (!file) return;

      // Backup des données existantes
      const backup = localStorage.getItem("prompts");

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const importData = JSON.parse(event.target.result);

          // Validation du format et de la version
          if (!this.validateImportData(importData)) {
            throw new Error(
              "Format de fichier invalide ou version non supportée"
            );
          }

          // Vérification des doublons
          const existingPrompts = this.getPromptsFromStorage();
          const duplicates = this.findDuplicates(
            existingPrompts,
            importData.prompts
          );

          if (duplicates.length > 0) {
            const shouldReplace = confirm(
              `${duplicates.length} prompts ont des IDs en conflit. Voulez-vous remplacer les versions existantes ?\n` +
                "Annuler conservera les versions existantes."
            );

            const mergedPrompts = this.mergePrompts(
              existingPrompts,
              importData.prompts,
              shouldReplace
            );
            this.savePromptsToStorage(mergedPrompts);
          } else {
            // Pas de doublons, on ajoute simplement les nouveaux prompts
            const allPrompts = [...existingPrompts, ...importData.prompts];
            this.savePromptsToStorage(allPrompts);
          }

          this.loadPrompts();
          e.target.value = ""; // Reset input
          alert("Import réussi !");
        } catch (error) {
          // Restauration en cas d'erreur
          if (backup) {
            localStorage.setItem("prompts", backup);
            this.loadPrompts();
          }
          throw error;
        }
      };

      reader.readAsText(file);
    } catch (error) {
      alert("Erreur lors de l'import : " + error.message);
    }
  }

  validateImportData(data) {
    return (
      data &&
      typeof data === "object" &&
      data.version &&
      data.timestamp &&
      Array.isArray(data.prompts) &&
      data.stats &&
      // Vérification basique de la version (peut être étendue pour la compatibilité)
      data.version === this.VERSION
    );
  }

  findDuplicates(existing, imported) {
    const existingIds = new Set(existing.map((p) => p.id));
    return imported.filter((p) => existingIds.has(p.id));
  }

  mergePrompts(existing, imported, replaceExisting) {
    const existingMap = new Map(existing.map((p) => [p.id, p]));

    if (replaceExisting) {
      // Remplacer les prompts existants par les versions importées
      imported.forEach((p) => existingMap.set(p.id, p));
    } else {
      // Garder les versions existantes
      imported.forEach((p) => {
        if (!existingMap.has(p.id)) {
          existingMap.set(p.id, p);
        }
      });
    }

    return Array.from(existingMap.values());
  }
}

// Initialisation
const promptLibrary = new PromptLibrary();
