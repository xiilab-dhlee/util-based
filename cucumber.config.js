module.exports = {
  default: [
    "tests/features/**/*.feature",
    "--require-module ts-node/register",
    "--require tests/step-definitions/**/*.ts",
    "--require tests/support/**/*.ts",
    "--format progress-bar",
    "--format json:tests/reports/cucumber-report.json",
    "--format html:tests/reports/cucumber-report.html",
    "--publish-quiet",
  ].join(" "),
};
