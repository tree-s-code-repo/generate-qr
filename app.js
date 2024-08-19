const baserUrl = '';

async function generateQRCode(url, imgUrl, size) {
  try {
    // Generate QR code as a Data URL
    const qrCodeDataURL = await QRCode.toDataURL(url, { width: size });

    // Create an img element for the QR code
    const qrImg = new Image();
    qrImg.src = qrCodeDataURL;

    const logoDataURL = await picToBase64('./img.png');
    const logoImg = new Image();
    logoImg.src = logoDataURL;

    // Combine images
    const combinedImageDataURL = combineImages(qrImg, logoImg, size);

    // Display the combined image
    displayQr(combinedImageDataURL);

    return combinedImageDataURL;
  } catch (error) {
    console.error(error);
    alert('Failed to generate QR code');
  }
}

// Calculate the size and position of the logo
function getLogoSize(qrSize) {
  const logoSize = qrSize / 5;
  const logoX = (qrSize - logoSize) / 2;
  const logoY = (qrSize - logoSize) / 2;
  return { logoSize, logoX, logoY };
}

function combineImages(qrImg, logoImg, qrSize) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to match QR code size
  canvas.width = qrSize;
  canvas.height = qrSize;

  // Draw QR code
  ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);
  const { logoSize, logoX, logoY } = getLogoSize(qrSize);

  // Draw logo in the center of the QR code
  ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
  // Return combined image as Data URL
  return canvas.toDataURL();
}

async function picToBase64(src) {
  const response = await fetch(src);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsDataURL(blob);
  });
}

function displayQr(combinedImageDataURL) {
  const container = document.getElementById('qrcodeContainer');
  container.innerHTML = ''; // Clear previous QR codes
  const finalImg = document.createElement('img');
  finalImg.src = combinedImageDataURL;
  finalImg.className = 'qrcodeImage'; // Optional: add a class for styling
  container.appendChild(finalImg);
}
