describe("Basic UI Elements", () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit("http://localhost:3000");
  });

  it("should have all main structural elements", () => {
    // Check main container
    cy.get('[data-test="translation-widget"]').should("exist");

    // Check navigation controls
    cy.get('[data-test="nav-controls"]').should("exist");
    cy.get('[data-test="theme-toggle"]').should("exist");
    cy.get('[data-test="model-select"]').should("exist");
    cy.get('[data-test="app-logo"]').should("exist");

    // Check main content areas
    cy.get('[data-test="source-panel"]').should("exist");
    cy.get('[data-test="source-input"]')
      .should("exist")
      .should("have.attr", "placeholder", "输入或粘贴要翻译的文本...");

    cy.get('[data-test="center-divider"]').should("exist");

    cy.get('[data-test="translation-panel"]').should("exist");
    cy.get('[data-test="translation-output"]').should("exist");
  });

  it("should have proper initial state", () => {
    // Check input is empty and focused
    cy.get('[data-test="source-input"]')
      .should("have.value", "")
      .should("have.focus");

    // Check translation output is empty
    cy.get('[data-test="translation-output"]').should("be.empty");

    // Copy button should not exist initially
    cy.get('[data-test="copy-button"]').should("not.exist");

    // Loading overlay should not be visible
    cy.get('[data-test="loading-overlay"]').should("not.exist");
  });

  it("should have working model selector with correct options", () => {
    // Check model selector exists and has correct initial value
    cy.get('[data-test="model-select"]')
      .should("exist")
      .should("have.value", "google");

    // Check all options exist
    cy.get('[data-test="model-select"] option').should("have.length", 4);

    // Check each option individually
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

    // Test model selection
    cy.get('[data-test="model-select"]').select("google");
    cy.get('[data-test="model-select"]').should("have.value", "google");

    cy.get('[data-test="model-select"]').select("openai");
    cy.get('[data-test="model-select"]').should("have.value", "openai");

    cy.get('[data-test="model-select"]').select("deepseek");
    cy.get('[data-test="model-select"]').should("have.value", "deepseek");
  });
});
