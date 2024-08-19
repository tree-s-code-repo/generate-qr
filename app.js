async function generateQRCode(url, imgUrl, size) {
  try {
    // Generate QR code as a Data URL
    const qrCodeDataURL = await QRCode.toDataURL(url, { width: size });

    // Create an img element for the QR code
    const qrImg = new Image();
    qrImg.src = qrCodeDataURL;

    // Load the logo image and handle the onload event
    const logoImg = new Image();
    logoImg.src = await picToBase64('./img.png');

    logoImg.onload = () => {
      // Combine images after the logo image has loaded
      const combinedImageDataURL = combineImages(qrImg, logoImg, size);

      // Display the combined image
      displayQr(combinedImageDataURL);
      return combinedImageDataURL;
    };

    logoImg.onerror = () => {
      console.error('Failed to load the logo image');
    };
  } catch (error) {
    console.error(error);
    alert('Failed to generate QR code');
  }
}

// Calculate the size and position of the logo
function getLogoSize(qrSize, padding) {
  const logoSize = qrSize / 5;
  const logoBackgroundSize = logoSize + padding * 2; // White background size
  const logoX = (qrSize - logoBackgroundSize) / 2;
  const logoY = (qrSize - logoBackgroundSize) / 2;

  return { logoSize, logoBackgroundSize, logoX, logoY, padding };
}
function combineImages(qrImg, logoImg, qrSize) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to match QR code size
  canvas.width = qrSize;
  canvas.height = qrSize;

  // Draw QR code
  ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);

  // Calculate the size and position of the logo
  const padding = 5; // Adjust this value to match your padding
  const { logoSize, logoBackgroundSize, logoX, logoY } = getLogoSize(
    qrSize,
    padding
  );

  // Draw the white background square (centered)
  ctx.fillStyle = 'white';
  ctx.fillRect(logoX, logoY, logoBackgroundSize, logoBackgroundSize);

  // Calculate the position for the logo within the white background
  const logoInnerX = logoX + padding; // Center the logo inside the white background
  const logoInnerY = logoY + padding;

  // Draw the logo image
  ctx.drawImage(logoImg, logoInnerX, logoInnerY, logoSize, logoSize);

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
