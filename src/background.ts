import browser from "webextension-polyfill";

const PROXY_SETTINGS = {
  host: null,
  port: null
}


async function fetchPublicIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    console.log("Public IP:", data.ip)
    return data.ip
  } catch (error) {
    console.error("Failed to fetch IP address:", error)
    throw error;
  }
}

async function getDeviceUUID() {
  const { DEVICE_ID } = await browser.storage.local.get('DEVICE_ID')
  if (DEVICE_ID) {
    return DEVICE_ID
  }

  const newDeviceId = crypto.randomUUID()
  browser.storage.local.set({ 'DEVICE_ID': newDeviceId })
  return newDeviceId
}

async function sendProxyRequest(deviceId: string, deviceIp: string) {
  try {
    const response = await fetch("https://uubb.website/api/v1/get-proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        device_id: deviceId,
        device_ip: deviceIp
      })
    });

    const { host, port } = await response.json();
    console.log("Proxy data:", host, port);
    PROXY_SETTINGS.host = host
    PROXY_SETTINGS.port = port
  } catch (error) {
    console.error("Failed to send proxy request:", error);
    throw error;
  }
}

async function setProxySettings() {
  if (!PROXY_SETTINGS.host || !PROXY_SETTINGS.port) {
    return;
  }

  const config = {
    mode: "fixed_servers",
    rules: {
      singleProxy: {
        scheme: "http",
        host: PROXY_SETTINGS.host,
        port: PROXY_SETTINGS.port
      },
      bypassList: ["localhost", "127.0.0.1"],
    }
  };

  try {
    await browser.proxy.settings.set(
      { value: config, scope: "regular" },
    );
  } catch (error) {
    console.log("Error setting proxy settings:", error);
  }
}

async function clearProxySettings() {
  try {
    await browser.proxy.settings.clear({ scope: "regular" });
  } catch (error) {
    console.error("Error clearing proxy settings:", error);
  }
}

function setupListeners() {
  browser.proxy.settings.onChange.addListener((details) => {
    console.log("Proxy settings changed:", details);
  });

  browser.webRequest.onBeforeRequest.addListener(
    function (details) {
      browser.storage.local.get('IS_CONNECTED').then(({ IS_CONNECTED }) => {
        const isConnected = IS_CONNECTED === 'TRUE';

        if (details.url.match(/^https:\/\/.*\.youtube\.com\//) && isConnected) {
          setProxySettings();
        } else {
          clearProxySettings();
        }
      }).catch((error) => {
        console.error('Error on onBeforeRequest: ', error);
        clearProxySettings();
      });
    },
    {
      urls: ["<all_urls>"]
    }
  )
};

async function setupProxy() {
  try {
    const deviceIp = await fetchPublicIP();
    const deviceId = await getDeviceUUID();
    await sendProxyRequest(deviceId, deviceIp);
  } catch (error) {
    console.error("Error in main execution:", error);
  }
}

browser.runtime.onInstalled.addListener(() => {
  setupListeners()
  setupProxy()
});
