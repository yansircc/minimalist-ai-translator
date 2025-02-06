describe("Translation Functionality", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    // Clear input and output before each test
    cy.get('[data-test="app-logo"]').click();
  });

  it("should handle basic translation flow", () => {
    const testText = "Hello, world!";

    // Type text and submit
    cy.get('[data-test="source-input"]').type(testText);
    cy.get('[data-test="source-input"]').type("{enter}");

    // Check loading state
    cy.get('[data-test="loading-overlay"]').should("exist");

    // Wait for translation
    cy.get('[data-test="translation-output"]', { timeout: 10000 })
      .should("not.be.empty")
      .should("not.contain", testText);

    // Check loading state is gone
    cy.get('[data-test="loading-overlay"]').should("not.exist");
  });

  it("should handle line breaks with Shift+Enter", () => {
    // Type text with line break
    cy.get('[data-test="source-input"]')
      .type("First line")
      .type("{shift+enter}")
      .type("Second line");

    // Verify line break exists
    cy.get('[data-test="source-input"]').should(
      "have.value",
      "First line\nSecond line",
    );

    // Translation should not have started
    cy.get('[data-test="translation-output"]').should("be.empty");
    cy.get('[data-test="loading-overlay"]').should("not.exist");
  });

  it("should handle empty input", () => {
    // Try to submit empty input
    cy.get('[data-test="source-input"]').type("{enter}");

    // Nothing should happen
    cy.get('[data-test="loading-overlay"]').should("not.exist");
    cy.get('[data-test="translation-output"]').should("be.empty");
  });

  it("should reset properly when clicking logo", () => {
    // Add some text and translate
    cy.get('[data-test="source-input"]').type("Test text{enter}");

    // Wait for translation
    cy.get('[data-test="translation-output"]', { timeout: 10000 }).should(
      "not.be.empty",
    );

    // Click logo to reset
    cy.get('[data-test="app-logo"]').click();

    // Check everything is reset
    cy.get('[data-test="source-input"]')
      .should("have.value", "")
      .should("have.focus");
    cy.get('[data-test="translation-output"]').should("be.empty");
    cy.get('[data-test="loading-overlay"]').should("not.exist");
  });

  it("should handle model switching during translation", () => {
    // Start translation with initial model
    cy.get('[data-test="source-input"]').type("Test text{enter}");

    // Wait for first translation
    cy.get('[data-test="translation-output"]', { timeout: 10000 }).should(
      "not.be.empty",
    );

    // Switch model
    cy.get('[data-test="model-select"]').select("google");

    // Type new text
    cy.get('[data-test="source-input"]').clear().type("Another test{enter}");

    // Check new translation appears
    cy.get('[data-test="translation-output"]')
      .should("not.be.empty")
      .should("not.contain", "Test text");
  });
});
