# PetKeeper (PetVault) — GitHub Pages Website & Google Play Console Guide

This directory contains the production-ready static web application for **PetKeeper** (`com.forneex.petkeeper`), tailored for **GitHub Pages** deployment and full compliance with **Google Play Developer Console** requirements.

---

## 📁 Included Pages

| File | Purpose | Google Play Field |
| :--- | :--- | :--- |
| **`index.html`** | Minimal, modern landing page with feature showcase & app badges | Main Website URL |
| **`about.html`** | About Forneex, engineering philosophy & offline-first mission | Developer Info |
| **`privacy-policy.html`** | Detailed, legally sound, GDPR & Google Play compliant privacy policy | **Privacy Policy URL** |
| **`delete-account.html`** | Account Deletion Portal with step-by-step in-app guide, web form & data retention disclosures | **Account Deletion URL** |
| **`terms.html`** | Terms of Service and veterinary medical disclaimer | Legal / Terms URL |
| **`css/style.css`** | Pure Vanilla CSS design system (Rose/blush palette `#c81a68`, Fredoka + Plus Jakarta Sans, responsive mobile nav) | Stylesheet |
| **`js/main.js`** | Mobile menu toggling, FAQ accordion, dynamic dates, and asynchronous form submission with mailto fallback | Script Logic |

---

## ❓ Critical Question: Where to Store Account Deletion Submissions? Can We Store Them in a Static File in GitHub Pages Privately?

### ✅ How Account Deletion Submissions Are Handled (Configured with `haideralidev258@gmail.com`)

The website is **pre-configured with FormSubmit (`https://formsubmit.co/ajax/haideralidev258@gmail.com`)**:

1. **How It Works**:
   - When a user fills out the Account Deletion form on `delete-account.html` and clicks **Submit**, JavaScript sends a background JSON POST request.
   - FormSubmit processes the request, filters spam, and immediately emails the complete deletion request (user email, pet name/UID, deletion scope, reason) to **`haideralidev258@gmail.com`**.
   - The user gets an immediate green success confirmation banner on screen.
2. **First-Time Activation Step**:
   - The **very first time** a submission is made, FormSubmit will send a 1-click confirmation email to `haideralidev258@gmail.com` asking you to activate the endpoint. Click the link in that email once, and all future deletion submissions will arrive in your inbox automatically!
3. **Built-in `mailto:` Fallback**:
   - If the user experiences network issues, or clicks the **"Send via Email App"** button, the site opens their email client with a pre-formatted message addressed directly to `haideralidev258@gmail.com`.

---

## 🚀 How to Deploy on GitHub Pages (Step-by-Step)

### Option A: Deploy from a `gh-pages` Branch in this Repository

1. Open your terminal in the project root:
   ```bash
   # Create and checkout a orphan gh-pages branch
   git checkout --orphan gh-pages
   
   # Remove all project files except the website folder
   git rm -rf .
   
   # Move website files to the root of gh-pages branch
   git checkout main -- website
   mv website/* .
   rm -rf website
   
   # Commit and push
   git add .
   git commit -m "feat: deploy PetKeeper landing page and policies to GitHub Pages"
   git push origin gh-pages --force
   ```

2. Go to your GitHub Repository ➔ **Settings** ➔ **Pages**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `gh-pages` / `/ (root)`
   - Click **Save**.
   - Your site will be live at: `https://<your-username>.github.io/<repo-name>/`

---

### Option B: Deploy in a Dedicated Repository (e.g. `petkeeper-web`)

1. Create a new repository on GitHub called `petkeeper-web`.
2. Copy the contents of the `website/` folder into that new repo.
3. Push to `main`.
4. Go to **Settings** ➔ **Pages** ➔ Select `main` branch ➔ Save.
5. Your site will be live at: `https://<your-username>.github.io/petkeeper-web/`

---

## 📋 Google Play Console URL Checklist

Once deployed, copy and paste these exact URLs into the Google Play Console:

| Google Play Console Field | Path in Website | Example URL |
| :--- | :--- | :--- |
| **Privacy Policy URL** (Store presence ➔ App content ➔ Privacy policy) | `/privacy-policy.html` | `https://<username>.github.io/<repo>/privacy-policy.html` |
| **Account Deletion URL** (App content ➔ Data safety ➔ Account deletion) | `/delete-account.html` | `https://<username>.github.io/<repo>/delete-account.html` |
| **Developer Website** (Store settings ➔ Contact details ➔ Website) | `/index.html` or `/` | `https://<username>.github.io/<repo>/` |

---

## 🔒 Google Play Data Safety Questionnaire Cheat Sheet

When filling out Google Play's Data Safety form:

- **Does your app collect or share any of the required user data types?** &rarr; `Yes`
- **Is all of the user data collected by your app encrypted in transit?** &rarr; `Yes` (TLS 1.3 / HTTPS)
- **Do you provide a way for users to request that their data is deleted?** &rarr; `Yes`
  - Paste your **Account Deletion URL**: `https://<username>.github.io/<repo>/delete-account.html`
- **Data Categories Collected**:
  - *Personal Info*: Email address (for authentication and sync account identification).
  - *Files & Docs*: Photos and PDF documents (stored in local sandbox and synced to private Cloudflare R2 when cloud backup is enabled).
  - *Financial Info*: In-app pet expense records (self-logged, not linked to real bank accounts or credit cards).
  - *App Performance / Analytics*: `No` (Zero third-party analytics trackers).
  - *Advertising*: `No` (Zero ad networks).
