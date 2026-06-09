const fs = require('fs');
const pdf = require('pdf-parse');

async function check(f) {
  try {
    let b = fs.readFileSync(f);
    let data = await pdf(b);
    let text = data.text;
    console.log(`\n--- File: ${f} ---`);
    console.log("CheeseCakeLabs:", text.includes('CheeseCakeLabs'));
    console.log("Human-Centered AI Interaction System:", text.includes('Human-Centered AI Interaction System'));
    console.log("AI Cyber Attack Detection System:", text.includes('AI Cyber Attack Detection System'));
    console.log("SIH 2024 Selection:", text.includes('SIH 2024 Selection'));
    console.log("Footprints Hackathon Runner-Up:", text.includes('Footprints Hackathon Runner-Up'));
  } catch (e) {
    console.log(`Error parsing ${f}`);
  }
}

async function run() {
  await check('C:/Users/saksh/Downloads/Sakshi_Srivastava_Resume.pdf');
  await check('C:/Users/saksh/Downloads/Sakshiresume.pdf');
  await check('C:/Users/saksh/Downloads/SAKSHI SRIVASTAVA_Set-1.pdf');
  await check('C:/Users/saksh/Downloads/shivangi.pdf');
}

run();
