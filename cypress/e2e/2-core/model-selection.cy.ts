describe("Model Selection", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should persist model selection after page reload", () => {
    // Select a different model
    cy.get('[data-test="model-select"]').select("google");
    cy.get('[data-test="model-select"]').should("have.value", "google");

    // Reload page
    cy.reload();

    // Check if selection persisted
    cy.get('[data-test="model-select"]').should("have.value", "google");
  });

  it("should have correct default model", () => {
    cy.get('[data-test="model-select"]').should("have.value", "google");
  });

  it("should maintain translation state when switching models", () => {
    // Type and translate with initial model
    cy.get('[data-test="source-input"]').type("Test text{enter}");

    // Wait for translation
    cy.get('[data-test="translation-output"]', { timeout: 10000 })
      .should("not.be.empty")
      .invoke("text")
      .then((text) => {
        const firstTranslation = text.trim();

        // Switch model
        cy.get('[data-test="model-select"]').select("google");

        // Original translation should still be visible
        cy.get('[data-test="translation-output"]')
          .invoke("text")
          .should((text) => {
            expect(text.trim()).to.equal(firstTranslation);
          });
      });
  });

  it("should handle rapid model switching", () => {
    // Switch models rapidly
    cy.get('[data-test="model-select"]').select("google");
    cy.get('[data-test="model-select"]').select("openai");
    cy.get('[data-test="model-select"]').select("groq");
    cy.get('[data-test="model-select"]').select("deepseek");

    // Type text after rapid switching
    cy.get('[data-test="source-input"]').type("Test after switching{enter}");

    // Should still translate normally
    cy.get('[data-test="translation-output"]', { timeout: 10000 })
      .should("not.be.empty")
      .should("not.contain", "Test after switching");
  });

  it("should show all available models", () => {
    cy.get('[data-test="model-select"] option').should("have.length", 3);

    // Verify model names and order
    cy.get('[data-test="model-option-groq"]')
      .should("exist")
      .should("have.text", "Groq");
    cy.get('[data-test="model-option-google"]')
      .should("exist")
      .should("have.text", "Gemini");
    cy.get('[data-test="model-option-openai"]')
      .should("exist")
      .should("have.text", "OpenAI");
    cy.get('[data-test="model-option-deepseek"]')
      .should("exist")
      .should("have.text", "DeepSeek");
  });
});
