/*

## Çalıştırılacak komutların bir dizisini oluşturuyoruz
const commands = ["dir", "echo Hello World", "error command"];

## Asenkron main fonksiyonunu tanımlıyoruz
async function main(data) {

  try {
  
    ## run fonksiyonunu çağırıyoruz ve komutların çalıştırılmasını bekliyoruz
    const result = await run(data);

    ## Komutların çalıştırılma sonucunu konsola yazdırıyoruz
    console.log(result);

  } catch (error) {

    ## run fonksiyonu sırasında bir hata oluşursa hatayı yakalayıp konsola yazdırıyoruz
    console.error("Error:", error);

  }
}

*/

const { spawn } = require("child_process");
const { promisify } = require("util");
const stream = require("stream");
const finished = promisify(stream.finished);
const Logger = require("./logger.js"); // Logger sınıfını içe aktarıyoruz
const logger = new Logger(); // Logları kaydetmek için bir Logger örneği oluşturuyoruz

// Bir komutu çalıştıran ve tamamlandığında bir Promise döndüren fonksiyon.
async function runCommand(command) {
  const [cmd, ...args] = command.split(" "); // Komutu ve argümanlarını ayırıyoruz.

  const process = spawn(cmd, args, { shell: true }); // Komutu çalıştırıyoruz.

  // stdout ve stderr akışlarının bitmesini bekliyoruz.
  await finished(process.stdout);
  await finished(process.stderr);

  // Komutun tamamlandığını belirten bir Promise döndürüyoruz.
  return new Promise((resolve, reject) => {
    process.on("close", (code) => {
      if (code !== 0) {
        logger.error(`Command failed: ${command} with exit code ${code}`);
        reject(new Error(`Command failed with exit code ${code}`)); // Hata kodu ile komut başarısız olduysa reject ediyoruz.
      } else {
        logger.info(`Command executed successfully: ${command}`);
        resolve(); // Komut başarılı bir şekilde tamamlandıysa resolve ediyoruz.
      }
    });
  });
}

// Bir dizi komutu sırayla çalıştıran fonksiyon.
async function runCommands(commands) {
  for (const command of commands) {
    try {
      await runCommand(command); // Her bir komutu sırayla çalıştırıyoruz ve tamamlanmasını bekliyoruz.
    } catch (error) {
      logger.error(`Error executing command "${command}": ${error.message}`); // Komut başarısız olduğunda hata mesajı yazdırıyoruz.
      throw error; // Hata durumunda hatayı yeniden fırlatıyoruz.
    }
  }
}

// Bir dizi komutu çalıştıran ve sonuçları döndüren fonksiyon.
async function run(commands) {
  try {
    await runCommands(commands);

    logger.info("All commands executed successfully.");
    return {
      message: true,
      status: "success",
    };
  } catch (error) {
    logger.error(`Error in run: ${error.message}`);
    return {
      message: error.message,
      status: "unsuccess",
    };
  }
}

module.exports = run;
