document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("darkModeToggle");
  
  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      if (toggleBtn) toggleBtn.textContent = "☀️";
    } else {
      document.body.classList.remove("dark-mode");
      if (toggleBtn) toggleBtn.textContent = "🌙";
    }
  };

  const storedTheme = localStorage.getItem("crypto-theme") || "light";
  applyTheme(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
      localStorage.setItem("crypto-theme", isDark ? "dark" : "light");
      toggleBtn.textContent = isDark ? "☀️" : "🌙";
    });
  }
});
