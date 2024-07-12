const { app, BrowserWindow, ipcMain } = require("electron"); // Electron modüllerini içe aktarır.
const path = require("path"); // Node.js'nin path modülünü içe aktarır.
const docker = require("./lib/docker");
const command = require("./lib/command");

async function createWindow() {
  try {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"), // Preload script'ini belirler.
        contextIsolation: true, // Context izolasyonunu etkinleştirir (güvenlik için).
        enableRemoteModule: false, // Uzak modülü devre dışı bırakır (güvenlik için).
      },
    });

    win.loadFile(path.join(__dirname, "./views/index.html")); // index.html dosyasını yükler.
  } catch (error) {
    console.error("API Request Error:", error.message);
  }
}

app.whenReady().then(() => {
  // Uygulama hazır olduğunda çalışır
  createWindow(); // Ana pencereyi oluşturur.

  app.on("activate", () => {
    // Uygulama yeniden etkinleştirildiğinde (örneğin, dock ikonuna tıklandığında) çalışır
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(); // Eğer açık pencere yoksa yeni bir pencere oluşturur.
    }
  });

  ipcMain.handle("search", async (event, data) => {
    const dockerData = await docker(data);
    return dockerData; // Gelen veriyi aynen geri döndürür.
  });

  ipcMain.handle("docker", async (event, data) => {
    const dockerData = await docker("node");
    return dockerData; // Gelen veriyi aynen geri döndürür.
  });

  ipcMain.handle("download", async (event, data) => {
    try {
      const dockerPull = [`docker pull ${data}`];

      const result = await command(dockerPull);
      console.log(result);
      if ((result.message = "unsuccess")) {
        return { message: "unsuccess" };
      }
      return { message: "success" };
    } catch (error) {
      console.error("Error:", error);
      return { message: "unsuccess" };
    }
  });
});

app.on("window-all-closed", () => {
  // Tüm pencereler kapatıldığında çalışır
  if (process.platform !== "darwin") {
    // Eğer işletim sistemi macOS değilse
    app.quit(); // Uygulamayı kapatır.
  }
});
