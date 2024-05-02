# Mirobot

This porject allows you to interact with Miro boards via a natural language interface.

It is built as a Miro application using the Miro WebSDK, Google Gemini, and Artyom.js.

## Getting started

**Createa a Google Gemini application**

Get a Gemini API key by [signing-up & following their getting started guide.](https://workspace.google.com/solutions/ai/signup?source=gafb-ai-hero-en&hl=en&ga_region=noram&ga_country=us&ga_lang=en)

> NOTE: Gemini free API calls are currently **only available in the US**. You may need a VPN to test this out.


**Createa a Miro application**

1. [Sign in](https://miro.com/login/) to Miro, and then create a
   [Developer team](https://developers.miro.com/docs/create-a-developer-team)
   under your user account.

2. [Create an app in Miro](https://developers.miro.com/docs/build-your-first-hello-world-app#step-2-create-your-app-in-miro).

- Click the **Create new app** button.
- On the **Create new app** modal, give your app a name, assign it to your
  Developer team, and then click **Create**.

3. Configure the app:

- In your account profile, go to **Your apps**, and then select the app you just
  created to access its configuration page.
- On the app configuration page, go to **App Credentials**, and copy the app
  **Client ID** and **Client secret** values: you'll need to enter these values
  in step 4 below.
- Go to **App URL** and enter the following URL: `http://localhost:3000`
- Go to **Redirect URI for OAuth2.0**, and enter the following redirect URL:
  `http://localhost:3000/api/redirect`
- Click **Options**. \
  From the drop-down menu select **Use this URI for SDK authorization**.
- Lastly, go to **Permissions**, and select the following permissions:
  - `board:read`
  - `board:write`
  - `microphone:listen` (for voice control)

4. Rename [`.env.template`](.env.template) to `.env`
5. Open the `.env` file, and replace:
    - the Miro app client ID and client secret values that you saved at the beginning of step 3 above.
    - your Google Gemini API key
6. Run `yarn start` to start developing.

When your server is up and running:

- Go to [Miro.com](https://miro.com).
- In your developer team, open a board.
- To start your app, click the app icon in the app toolbar on the left.

> NOTE: Voice control currently mainly works with **Google Chrome** other browsers (even Chromium ones) may not work as expected.
