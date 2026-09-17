# 3DS Anatomical Vision

A web-based, real-time human anatomy detection system and digital anatomy atlas.


https://github.com/user-attachments/assets/2acd5678-8481-4290-ae01-a1c47179c2a2


## Setup and Execution

The application runs entirely on the client side (in the browser) and utilizes MediaPipe Tasks Vision. However, for security reasons, camera access requires the application to be served via `localhost` or `https`.

### Local Development Server (using Node.js)
If you have Node.js installed on your system, you can run the application using `http-server` or `serve`:

```bash
npx http-server .
```
Then, navigate to `http://127.0.0.1:8080` in your browser.

### Usage

1. Click the **Start Camera** button and grant permission for camera access.
2. Once the camera activates, the MediaPipe models will load.
3. Click on the detected regions (colored dots) that appear on the screen, such as the shoulder, nose, or chest.
4. You can view anatomical information (Latin name, category, description, etc.) for the selected region in the right-hand panel.

## Note
The MVP version relies on the MediaPipe CDN and requires an internet connection to function. Downloading the models during the initial load may take a few seconds.
