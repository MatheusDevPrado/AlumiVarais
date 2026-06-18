const menuButton = document.querySelector("#menuButton");
const navLinks = document.querySelectorAll(".main-nav a");
const editableFields = document.querySelectorAll("[data-save]");
const imageInputs = document.querySelectorAll(".image-input");

menuButton.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
  });
});

editableFields.forEach((field) => {
  const key = `alumivarais-${field.dataset.save}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    field.value = saved;
  }
  updateStarPreview(field);
  field.addEventListener("input", () => {
    localStorage.setItem(key, field.value);
    updateStarPreview(field);
  });
  field.addEventListener("change", () => {
    localStorage.setItem(key, field.value);
    updateStarPreview(field);
  });
});

imageInputs.forEach((input, index) => {
  const preview = input.parentElement.querySelector(".image-preview, .avatar-preview");
  const key = `alumivarais-image-${index}`;
  const savedImage = localStorage.getItem(key);
  if (savedImage && preview) {
    setPreview(preview, savedImage);
  }

  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file || !preview) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Escolha um arquivo de imagem.");
      input.value = "";
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setPreview(preview, reader.result);
      try {
        localStorage.setItem(key, reader.result);
      } catch {
        alert("Imagem muito grande para salvar neste navegador. Use uma imagem menor ou otimize o arquivo.");
      }
    });
    reader.readAsDataURL(file);
  });
});

function setPreview(preview, imageUrl) {
  preview.style.backgroundImage = `url("${imageUrl}")`;
  preview.classList.add("has-image");
}

function updateStarPreview(field) {
  if (!field.dataset.save || !field.dataset.save.includes("stars")) {
    return;
  }
  const preview = field.parentElement.querySelector(".star-preview");
  if (!preview) {
    return;
  }
  const rating = Number(field.value || 0);
  preview.textContent = rating ? "*".repeat(rating) : "*****";
  preview.style.opacity = rating ? "1" : "0.34";
}
