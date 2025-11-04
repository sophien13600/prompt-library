class PromptMetadata {
  constructor() {
    this.maxModelNameLength = 100;
  }

  /**
   * Track model metadata for a prompt
   * @param {string} modelName - Name of the model
   * @param {string} content - Prompt content
   * @returns {Object} Metadata object
   * @throws {Error} If inputs are invalid
   */
  trackModel(modelName, content) {
    // Validation
    if (!modelName || typeof modelName !== "string") {
      throw new Error("Le nom du modèle doit être une chaîne non vide");
    }
    if (modelName.length > this.maxModelNameLength) {
      throw new Error(
        `Le nom du modèle ne doit pas dépasser ${this.maxModelNameLength} caractères`
      );
    }
    if (!content || typeof content !== "string") {
      throw new Error("Le contenu doit être une chaîne non vide");
    }

    const now = new Date().toISOString();
    return {
      model: modelName,
      createdAt: now,
      updatedAt: now,
      tokenEstimate: this.estimateTokens(content, false),
    };
  }

  /**
   * Update timestamps in metadata object
   * @param {Object} metadata - Metadata object to update
   * @returns {Object} Updated metadata object
   * @throws {Error} If dates are invalid
   */
  updateTimestamps(metadata) {
    const now = new Date();
    const created = new Date(metadata.createdAt);

    if (isNaN(created.getTime())) {
      throw new Error("Date de création invalide");
    }

    if (now < created) {
      throw new Error(
        "La date de mise à jour ne peut pas être antérieure à la date de création"
      );
    }

    return {
      ...metadata,
      updatedAt: now.toISOString(),
    };
  }

  /**
   * Estimate token count for text
   * @param {string} text - Text to analyze
   * @param {boolean} isCode - Whether text is code
   * @returns {Object} Token estimate object
   */
  estimateTokens(text, isCode) {
    const words = text.trim().split(/\s+/).length;
    const chars = text.length;

    let min = Math.ceil(0.75 * words);
    let max = Math.ceil(0.25 * chars);

    if (isCode) {
      min = Math.ceil(min * 1.3);
      max = Math.ceil(max * 1.3);
    }

    let confidence = "high";
    if (max > 5000) {
      confidence = "low";
    } else if (max > 1000) {
      confidence = "medium";
    }

    return {
      min,
      max,
      confidence,
    };
  }

  /**
   * Format date for display
   * @param {string} isoDate - ISO 8601 date string
   * @returns {string} Formatted date string
   */
  formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("fr-FR", options);
  }
}
