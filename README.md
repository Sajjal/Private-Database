# Welcome

### Thank you for exploring S & D Private Database.

It is a web-based note-taking application that uses the AES-256-CBC algorithm to securely encrypt user data with a Private key.

This application is developed using Node.js, Express.js, HTML, and CSS. Crypto is used for encryption. The user interface is responsive and minimal.

**Feel free to Clone and Fork. Commercial Distribution is Prohibited.**

---

## Background (_Why this application was developed?_)

There is no specific reason for the development of this application. I did it as a fun project and it turns out to be a secure vault to store sensitive personal information.

If you are looking for some traditional note-taking application then I suggest to checkout **Daily-Journal:**
`https://github.com/Sajjal/Daily-Journal`

---

## Features and Drawbacks:

### Features:

- Data Encryption with Private Key.
- No third party database system is used, data are stored in the file system.
- Easy to Backup and Restore.

### Drawbacks:

- Designed for a single user.
- Designed to run in a local system. Deploying in the cloud server is not recommended.

---

## Prerequisites:

### Node.js:

- Install **Node.js** on your machine.

---

## Installation:

1. Clone this Project.
2. Edit `.env` file and update the value of `KEY` and `IV`.
3. Open terminal/command-prompt. **cd** to project directory and type:

   i. `npm install`

   ii. `npm start`

4. Type `http://localhost:3500` on your browser's address bar and hit Enter.
5. The Default username is `admin` and the default password is `admin` **Enjoy.**

**PS:** To enjoy the Backup/Restore feature run this application as a root user.

---

## Demo:

**Login Page:**

<img src="https://github.com/Sajjal/Private-Database/blob/master/public/images/Screen_shots/login.png">

---

**Home Page:**

<img src="https://github.com/Sajjal/Private-Database/blob/master/public/images/Screen_shots/home.png">

---

**Add New Record:**

<img src="https://github.com/Sajjal/Private-Database/blob/master/public/images/Screen_shots/add.png">

---

**Edit Record:**

<img src="https://github.com/Sajjal/Private-Database/blob/master/public/images/Screen_shots/edit.png">

---

**Backup / Restore:**

<img src="https://github.com/Sajjal/Private-Database/blob/master/public/images/Screen_shots/backup.png">

---

**Encrypted Data File:**

<img src="https://github.com/Sajjal/Private-Database/blob/master/public/images/Screen_shots/data.png">

---

With Love,

**Sajjal**
