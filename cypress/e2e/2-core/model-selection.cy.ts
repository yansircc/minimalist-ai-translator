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

  it("should show all available models", () => {
    cy.get('[data-test="model-select"] option').should("have.length", 4);

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
