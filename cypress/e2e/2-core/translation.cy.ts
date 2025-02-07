describe("Translation Functionality", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    // 每次测试前清空输入和输出
    cy.get('[data-test="app-logo"]').click();
  });

  it("should handle line breaks with Shift+Enter", () => {
    // 测试使用 Shift+Enter 输入换行
    cy.get('[data-test="source-input"]')
      .type("First line")
      .type("{shift+enter}")
      .type("Second line");

    // 验证换行存在
    cy.get('[data-test="source-input"]').should(
      "have.value",
      "First line\nSecond line",
    );

    // 确认没有自动开始翻译
    cy.get('[data-test="translation-output"]').should("be.empty");
  });

  it("should handle empty input", () => {
    // 测试空输入
    cy.get('[data-test="source-input"]').type("{enter}");

    // 确认没有任何反应
    cy.get('[data-test="translation-output"]').should("be.empty");
  });

  it("should reset properly when clicking logo", () => {
    // 输入一些文本
    cy.get('[data-test="source-input"]').type("Test text");

    // 点击 logo 重置
    cy.get('[data-test="app-logo"]').click();

    // 检查是否完全重置
    cy.get('[data-test="source-input"]')
      .should("have.value", "")
      .should("have.focus");
    cy.get('[data-test="translation-output"]').should("be.empty");
  });

  it("should have proper input and output areas", () => {
    // 检查输入区域
    cy.get('[data-test="source-input"]')
      .should("exist")
      .should("be.visible")
      .should("have.attr", "placeholder", "Input here...");

    // 检查输出区域
    cy.get('[data-test="translation-output"]')
      .should("exist")
      .should("be.visible")
      .should("be.empty");
  });
});
