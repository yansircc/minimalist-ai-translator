describe("Responsive Layout", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  context("Mobile Layout", () => {
    beforeEach(() => {
      // Set viewport to mobile size
      cy.viewport(375, 667); // iPhone SE
    });

    it("should show vertical layout on mobile", () => {
      // Check if panels are stacked vertically
      cy.get('[data-test="source-panel"]').should(($panel) => {
        const rect = $panel[0]?.getBoundingClientRect();
        expect(rect?.width).to.be.closeTo(375, 10); // Full width
      });

      cy.get('[data-test="translation-panel"]').should(($panel) => {
        const rect = $panel[0]?.getBoundingClientRect();
        expect(rect?.width).to.be.closeTo(375, 10); // Full width
      });
    });

    it("should have accessible controls on mobile", () => {
      // Check if controls are visible and clickable
      cy.get('[data-test="theme-toggle"]').should("be.visible");
      cy.get('[data-test="model-select"]').should("be.visible");
      cy.get('[data-test="app-logo"]').should("be.visible");
    });
  });

  context("Tablet Layout", () => {
    beforeEach(() => {
      cy.viewport(768, 1024); // iPad
    });

    it("should show horizontal layout on tablet", () => {
      // Check if panels are side by side
      cy.get('[data-test="source-panel"]').should("be.visible");
      cy.get('[data-test="translation-panel"]').should("be.visible");
      cy.get('[data-test="center-divider"]').should("be.visible");
    });
  });

  context("Desktop Layout", () => {
    beforeEach(() => {
      cy.viewport(1280, 800); // Standard desktop
    });

    it("should show horizontal layout on desktop", () => {
      // Check if panels are side by side with equal width
      cy.get('[data-test="source-panel"]').should(($panel) => {
        const rect = $panel[0]?.getBoundingClientRect();
        expect(rect?.width).to.be.greaterThan(500); // Reasonable desktop width
      });

      cy.get('[data-test="translation-panel"]').should(($panel) => {
        const rect = $panel[0]?.getBoundingClientRect();
        expect(rect?.width).to.be.greaterThan(500); // Reasonable desktop width
      });
    });

    it("should maintain layout after translation", () => {
      // Perform translation
      cy.get('[data-test="source-input"]').type("Test text{enter}");

      // Wait for translation
      cy.get('[data-test="translation-output"]', { timeout: 10000 }).should(
        "not.be.empty",
      );

      // Check if layout remains correct
      cy.get('[data-test="source-panel"]').should("be.visible");
      cy.get('[data-test="translation-panel"]').should("be.visible");
      cy.get('[data-test="center-divider"]').should("be.visible");
    });
  });

  it("should handle window resizing", () => {
    // Start with desktop
    cy.viewport(1280, 800);
    cy.get('[data-test="center-divider"]').should("be.visible");

    // Switch to mobile
    cy.viewport(375, 667);
    cy.get('[data-test="source-panel"]').should("be.visible");
    cy.get('[data-test="translation-panel"]').should("be.visible");

    // Back to desktop
    cy.viewport(1280, 800);
    cy.get('[data-test="center-divider"]').should("be.visible");
  });
});
