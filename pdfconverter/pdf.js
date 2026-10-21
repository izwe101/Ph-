const matrixLoader = document.getElementById("matrixLoader");
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const letters = "1 0" ;
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1a581aff";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

let matrixInterval;


const imageInput = document.getElementById("imageInput");
const convertBtn = document.getElementById("convertBtn");
const pdfNameInput = document.getElementById("pdfName");



convertBtn.addEventListener("click", () => {
  if (imageInput.files.length === 0) {
    alert("Please select at least one image");
    return;
  }

  matrixLoader.style.display = "flex";
  resizeCanvas();
  matrixInterval = setInterval(drawMatrix, 33);

  setTimeout(async () => {
    clearInterval(matrixInterval);
    matrixLoader.style.display = "none";
    await convertImagesToPDF();
  }, 4000);
});


async function convertImagesToPDF() {
  const files = imageInput.files;
  const pdfName = pdfNameInput.value || "images";

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  for (let i = 0; i < files.length; i++) {
    const imgData = await readImage(files[i]);
    const img = new Image();
    img.src = imgData;

    await new Promise(resolve => {
      img.onload = () => {
        // 1. Get PDF page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // 2. Calculate ratios
        const imgRatio = img.width / img.height;
        const pageRatio = pageWidth / pageHeight;

        let finalWidth, finalHeight;

        // 3. Determine if image is limited by Width or Height
        if (imgRatio > pageRatio) {
          // Image is very wide: fill width, scale height
          finalWidth = pageWidth - 20; // 10mm margin on each side
          finalHeight = finalWidth / imgRatio;
        } else {
          // Image is very tall: fill height, scale width
          finalHeight = pageHeight - 20; // 10mm margin top/bottom
          finalWidth = finalHeight * imgRatio;
        }

        if (i !== 0) pdf.addPage();
        
        // 4. Center the image on the page
        const xOffset = (pageWidth - finalWidth) / 2;
        const yOffset = (pageHeight - finalHeight) / 2;

        pdf.addImage(img, "JPEG", xOffset, yOffset, finalWidth, finalHeight);
        resolve();
      };
    });
  }

  pdf.save(`${pdfName}.pdf`);
}



function readImage(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}